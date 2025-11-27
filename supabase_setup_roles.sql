-- =====================================================
-- SCRIPT 1: Crear estructura de roles y tabla profiles
-- =====================================================
-- Ejecutar en Supabase SQL Editor

-- Crear enum para los roles
CREATE TYPE user_role AS ENUM ('usuario', 'terapeuta', 'administrador');

-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'usuario',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: usuarios pueden actualizar su propio perfil (excepto el role)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política: administradores pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- Política: administradores pueden actualizar cualquier perfil
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- =====================================================
-- SCRIPT 2: Función y trigger para nuevos usuarios
-- =====================================================

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    'usuario'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función al crear usuario
-- Eliminar trigger si ya existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SCRIPT 3: Migrar usuarios existentes
-- =====================================================

-- Insertar perfiles para usuarios que ya existen
INSERT INTO public.profiles (id, full_name, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', email),
  'usuario'::user_role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SCRIPT 4: Función helper para cambiar roles (opcional)
-- =====================================================

-- Función para que admins cambien roles de usuarios
CREATE OR REPLACE FUNCTION public.update_user_role(
  user_id UUID,
  new_role user_role
)
RETURNS VOID AS $$
BEGIN
  -- Solo admins pueden cambiar roles
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  ) THEN
    UPDATE public.profiles
    SET role = new_role, updated_at = NOW()
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Only administrators can change roles';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SCRIPT 5: Asignar rol de administrador al primer usuario
-- =====================================================

-- Cambia 'tu-email@ejemplo.com' por tu email real
UPDATE public.profiles
SET role = 'administrador'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'tu-email@ejemplo.com'
  LIMIT 1
);

-- =====================================================
-- VERIFICACIÓN: Consultar perfiles creados
-- =====================================================

-- Ver todos los perfiles y sus roles
SELECT 
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC;
