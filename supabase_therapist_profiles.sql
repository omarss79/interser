-- =====================================================
-- ESTRUCTURA DE BASE DE DATOS PARA PERFILES DE TERAPEUTAS
-- =====================================================

-- =====================================================
-- PASO 1: Agregar campos a la tabla profiles
-- =====================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title TEXT; -- Ej: "Dra.", "MC.", "Dr."
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS professional_id TEXT; -- Cédula profesional
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS therapeutic_approach TEXT; -- Ej: "Gestalt", "Humanista"
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Índice para búsquedas rápidas por slug
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug) WHERE slug IS NOT NULL;

-- =====================================================
-- PASO 2: Crear tabla de credenciales académicas
-- =====================================================

CREATE TABLE IF NOT EXISTS public.therapist_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL, -- "Licenciatura", "Maestría", "Doctorado", "Certificación", "Especialización"
  title TEXT NOT NULL,
  institution TEXT,
  year INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credentials_therapist ON public.therapist_credentials(therapist_id);

-- =====================================================
-- PASO 3: Crear tabla de especialidades/servicios
-- =====================================================

CREATE TABLE IF NOT EXISTS public.therapist_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_therapist ON public.therapist_services(therapist_id);

-- =====================================================
-- PASO 4: Crear tabla de áreas de intervención
-- =====================================================

CREATE TABLE IF NOT EXISTS public.therapist_interventions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  intervention_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interventions_therapist ON public.therapist_interventions(therapist_id);

-- =====================================================
-- PASO 5: Políticas RLS para las nuevas tablas
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.therapist_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_interventions ENABLE ROW LEVEL SECURITY;

-- Políticas para therapist_credentials
CREATE POLICY "Public can view credentials" ON public.therapist_credentials
  FOR SELECT USING (true);

CREATE POLICY "Therapists can manage own credentials" ON public.therapist_credentials
  FOR ALL USING (
    auth.uid() = therapist_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrador')
  );

-- Políticas para therapist_services
CREATE POLICY "Public can view services" ON public.therapist_services
  FOR SELECT USING (true);

CREATE POLICY "Therapists can manage own services" ON public.therapist_services
  FOR ALL USING (
    auth.uid() = therapist_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrador')
  );

-- Políticas para therapist_interventions
CREATE POLICY "Public can view interventions" ON public.therapist_interventions
  FOR SELECT USING (true);

CREATE POLICY "Therapists can manage own interventions" ON public.therapist_interventions
  FOR ALL USING (
    auth.uid() = therapist_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrador')
  );

-- =====================================================
-- PASO 6: Insertar datos de los 3 terapeutas
-- =====================================================

-- IMPORTANTE: Primero debes crear manualmente estos usuarios en Supabase Auth
-- o actualizar los IDs en este script después de crearlos

-- Variables para IDs (reemplazar con los IDs reales de Supabase)
-- Puedes obtener los IDs ejecutando: SELECT id, email FROM auth.users;

-- 1. DRA. ALICIA COLORADO SOLANO
DO $$
DECLARE
  alicia_id UUID;
BEGIN
  -- Buscar o crear el perfil de Alicia
  SELECT id INTO alicia_id FROM auth.users WHERE email = 'alicia.colorado@interser.org.mx' LIMIT 1;
  
  IF alicia_id IS NOT NULL THEN
    -- Actualizar perfil
    UPDATE public.profiles SET
      slug = 'dra-alicia-colorado-solano',
      title = 'Dra.',
      full_name = 'Alicia Colorado Solano',
      bio = 'Psicóloga Humanista con Doctorado dedicada a crear un espacio seguro y comprensivo para explorar tus pensamientos, emociones y metas. Con más de 15 años de experiencia clínica, mi enfoque centrado en la persona te ayudará a descubrir tu potencial y a superar desafíos.',
      photo_url = 'https://interser.org.mx/pages/dra-alicia-colorado-solano/images/alicia-colorado.jpg',
      professional_id = '12213582',
      phone = '6671900111',
      whatsapp = '5216671900111',
      years_experience = 15,
      therapeutic_approach = 'Psicoterapia con enfoque Gestalt y Humanista',
      is_public = true,
      role = 'terapeuta'
    WHERE id = alicia_id;

    -- Insertar credenciales
    INSERT INTO public.therapist_credentials (therapist_id, credential_type, title, display_order) VALUES
    (alicia_id, 'Licenciatura', 'Psicóloga Humanista con Acentuación y Evaluación en Psicoterapia', 1),
    (alicia_id, 'Maestría', 'Maestra en Psicoterapia Humanista', 2),
    (alicia_id, 'Maestría', 'Maestra en Yoga', 3),
    (alicia_id, 'Doctorado', 'Doctora en Psicoterapia Humanista con especialidad en duelos por divorcio, muerte y otras pérdidas', 4),
    (alicia_id, 'Certificación', 'Maestra en Educación de la Sexualidad', 5);

    -- Insertar servicios
    INSERT INTO public.therapist_services (therapist_id, service_name, description, display_order) VALUES
    (alicia_id, 'Terapia Individual', 'Sesiones personalizadas centradas en tus necesidades únicas', 1),
    (alicia_id, 'Terapia de Pareja', 'Fortalece la comunicación y la conexión emocional', 2),
    (alicia_id, 'Desarrollo Personal', 'Talleres y sesiones específicas para el crecimiento personal', 3),
    (alicia_id, 'Gestión del Estrés', 'Herramientas prácticas para manejar el estrés cotidiano', 4),
    (alicia_id, 'Grupos de Psicoterapia', 'Trabajo en grupos con temas de autoestima, comunicación, duelos', 5),
    (alicia_id, 'Terapia Familiar', 'Intervención en psicoterapia familiar', 6);

    -- Insertar áreas de intervención
    INSERT INTO public.therapist_interventions (therapist_id, intervention_name, display_order) VALUES
    (alicia_id, 'Primeros Auxilios Psicológicos', 1),
    (alicia_id, 'Psicodiagnósticos en adultos y adolescentes', 2),
    (alicia_id, 'Masaje de desbloqueo psicocorporal', 3),
    (alicia_id, 'Duelos por divorcio, muerte y otras pérdidas', 4),
    (alicia_id, 'Docente en la Universidad de Nexum de México', 5);

    RAISE NOTICE 'Perfil de Dra. Alicia Colorado actualizado exitosamente';
  ELSE
    RAISE NOTICE 'Usuario alicia.colorado@interser.org.mx no encontrado. Créalo primero en Supabase Auth.';
  END IF;
END $$;

-- 2. MC. PAULINA GÓMEZ GERMÁN
DO $$
DECLARE
  paulina_id UUID;
BEGIN
  SELECT id INTO paulina_id FROM auth.users WHERE email = 'paulina.gomez@interser.org.mx' LIMIT 1;
  
  IF paulina_id IS NOT NULL THEN
    UPDATE public.profiles SET
      slug = 'mc-paulina-gomez-german',
      title = 'MC.',
      full_name = 'Paulina Gómez Germán',
      bio = 'Licenciada en psicología humanista, con especialidad de maestría en sexualidad, estudios de terapia cognitivo conductual y primeros auxilios psicológicos. Se busca que el plan de tratamiento y la intervención sea de manera personalizada, ajustado a tus necesidades y lo que sea más conveniente para ti.',
      photo_url = 'https://interser.org.mx/pages/mc-paulina-gomez-german/images/paulina-gomez.jpg',
      phone = '6671792487',
      whatsapp = '5216671792487',
      years_experience = 7,
      therapeutic_approach = 'Humanista y Cognitivo Conductual',
      is_public = true,
      role = 'terapeuta'
    WHERE id = paulina_id;

    INSERT INTO public.therapist_credentials (therapist_id, credential_type, title, display_order) VALUES
    (paulina_id, 'Licenciatura', 'Licenciada en Psicología Humanista', 1),
    (paulina_id, 'Maestría', 'Máster en Educación de la Sexualidad', 2),
    (paulina_id, 'Certificación', 'Terapia Cognitivo Conductual', 3),
    (paulina_id, 'Certificación', 'Primeros Auxilios Psicológicos', 4),
    (paulina_id, 'Certificación', 'Psicoterapia en línea', 5);

    INSERT INTO public.therapist_services (therapist_id, service_name, description, display_order) VALUES
    (paulina_id, 'Terapia Individual', 'Autoestima, sentido de vida, conflictos de la vida cotidiana. Depresión, ansiedad, TLP, tratamientos con enfoque humanista y cognitivo conductual', 1),
    (paulina_id, 'Terapia de Pareja', 'Manejo de conflicto en la pareja, problemas de intimidad, comunicación en la pareja, problemáticas en sexualidad y acompañamiento si hay decisión de separación', 2),
    (paulina_id, 'Terapia Sexológica', 'Abuso sexual, disfunciones sexuales, conflictos ligados a la orientación sexual y proceso de transición de género', 3);

    INSERT INTO public.therapist_interventions (therapist_id, intervention_name, display_order) VALUES
    (paulina_id, 'Ansiedad y depresión', 1),
    (paulina_id, 'Abuso sexual', 2),
    (paulina_id, 'Proceso de transición de género', 3),
    (paulina_id, 'Disfunciones sexuales', 4),
    (paulina_id, 'Orientación sexual', 5),
    (paulina_id, 'Relación de pareja', 6),
    (paulina_id, 'Problemas familiares', 7);

    RAISE NOTICE 'Perfil de MC. Paulina Gómez actualizado exitosamente';
  ELSE
    RAISE NOTICE 'Usuario paulina.gomez@interser.org.mx no encontrado. Créalo primero en Supabase Auth.';
  END IF;
END $$;

-- 3. DR. JUAN GÓMEZ ALFARO
DO $$
DECLARE
  juan_id UUID;
BEGIN
  SELECT id INTO juan_id FROM auth.users WHERE email = 'juan.gomez@interser.org.mx' LIMIT 1;
  
  IF juan_id IS NOT NULL THEN
    UPDATE public.profiles SET
      slug = 'dr-juan-gomez-alfaro',
      title = 'Dr.',
      full_name = 'Juan Gómez Alfaro',
      bio = '20 años de práctica continua en psicoterapia con adultos, parejas adolescentes y jóvenes. Cofundador de InterSer - Centro Psicoterapéutico Humanista. Formador de psicólogos y psicoterapeutas en el nivel licenciatura, maestría y doctorado en instituciones educativas especializadas. Con la psicoterapia no puedes controlarlo todo, pero tienes el poder de decidir que te vaya bien pase lo que pase.',
      phone = '6672088939',
      whatsapp = '5216672088939',
      years_experience = 20,
      is_public = true,
      role = 'terapeuta',
      therapeutic_approach = 'Psicoterapia Gestalt y Humanista'
    WHERE id = juan_id;

    -- Insertar credenciales
    INSERT INTO public.therapist_credentials (therapist_id, credential_type, title, display_order) VALUES
    (juan_id, 'Maestría', 'Master en Psicoterapia Gestalt', 1),
    (juan_id, 'Doctorado', 'Doctorado en Psicoterapia Humanista', 2),
    (juan_id, 'Certificación', 'Experiencia en terapia psicológica y primeros auxilios psicológicos en línea', 3);

    -- Insertar servicios/áreas de especialización
    INSERT INTO public.therapist_services (therapist_id, service_name, description, display_order) VALUES
    (juan_id, 'Psicoterapia Profesional', 'Trabajamos la terapia del aquí y el ahora, herramientas cognitivas que ayudan a tener una mejor interpretación de la realidad y el manejo de las emociones', 1),
    (juan_id, 'Coaching de Vida', 'Plan de vida y carrera, desarrollo de potencial y superación bloqueos, claridad de objetivos y logro de metas', 2),
    (juan_id, 'Capacitación Empresarial', 'Asesoria y orientación para grupos de trabajo, comunicación efectiva, liderazgo y manejo de procesos conductuales', 3),
    (juan_id, 'Cursos y Talleres', 'Formación especializada en diferentes áreas de la psicoterapia', 4);

    -- Insertar áreas de intervención
    INSERT INTO public.therapist_interventions (therapist_id, intervention_name, display_order) VALUES
    (juan_id, 'Ansiedad y depresión', 1),
    (juan_id, 'Duelos', 2),
    (juan_id, 'Asuntos de pareja', 3),
    (juan_id, 'Proyectos de vida', 4),
    (juan_id, 'Trastornos psicológicos', 5),
    (juan_id, 'Adolescentes y jóvenes', 6),
    (juan_id, 'Comunicación y liderazgo', 7);

    RAISE NOTICE 'Perfil de Dr. Juan Gómez Alfaro actualizado exitosamente';
  ELSE
    RAISE NOTICE 'Usuario juan.gomez@interser.org.mx no encontrado. Créalo primero en Supabase Auth.';
  END IF;
END $$;

-- =====================================================
-- PASO 7: Verificación de datos insertados
-- =====================================================

-- Ver perfiles de terapeutas
SELECT 
  p.id,
  p.title,
  p.full_name,
  p.slug,
  p.role,
  p.years_experience,
  p.is_public,
  p.phone
FROM public.profiles p
WHERE p.role = 'terapeuta' AND p.is_public = true
ORDER BY p.full_name;

-- Ver credenciales por terapeuta
SELECT 
  p.full_name,
  c.credential_type,
  c.title,
  c.display_order
FROM public.therapist_credentials c
JOIN public.profiles p ON p.id = c.therapist_id
ORDER BY p.full_name, c.display_order;

-- Ver servicios por terapeuta
SELECT 
  p.full_name,
  s.service_name,
  s.description
FROM public.therapist_services s
JOIN public.profiles p ON p.id = s.therapist_id
ORDER BY p.full_name, s.display_order;
