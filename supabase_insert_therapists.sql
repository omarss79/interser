-- =====================================================
-- INSERTAR DATOS DE LOS 3 TERAPEUTAS CON IDS ESPECÍFICOS
-- =====================================================

-- 1. DRA. ALICIA COLORADO SOLANO
-- ID: 23768af8-0bf5-4919-aa6b-68379f1c8460

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
WHERE id = '23768af8-0bf5-4919-aa6b-68379f1c8460';

-- Insertar credenciales
INSERT INTO public.therapist_credentials (therapist_id, credential_type, title, display_order) VALUES
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Licenciatura', 'Psicóloga Humanista con Acentuación y Evaluación en Psicoterapia', 1),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Maestría', 'Maestra en Psicoterapia Humanista', 2),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Maestría', 'Maestra en Yoga', 3),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Doctorado', 'Doctora en Psicoterapia Humanista con especialidad en duelos por divorcio, muerte y otras pérdidas', 4),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Certificación', 'Maestra en Educación de la Sexualidad', 5);

-- Insertar servicios
INSERT INTO public.therapist_services (therapist_id, service_name, description, display_order) VALUES
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Terapia Individual', 'Sesiones personalizadas centradas en tus necesidades únicas', 1),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Terapia de Pareja', 'Fortalece la comunicación y la conexión emocional', 2),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Desarrollo Personal', 'Talleres y sesiones específicas para el crecimiento personal', 3),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Gestión del Estrés', 'Herramientas prácticas para manejar el estrés cotidiano', 4),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Grupos de Psicoterapia', 'Trabajo en grupos con temas de autoestima, comunicación, duelos', 5),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Terapia Familiar', 'Intervención en psicoterapia familiar', 6);

-- Insertar áreas de intervención
INSERT INTO public.therapist_interventions (therapist_id, intervention_name, display_order) VALUES
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Primeros Auxilios Psicológicos', 1),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Psicodiagnósticos en adultos y adolescentes', 2),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Masaje de desbloqueo psicocorporal', 3),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Duelos por divorcio, muerte y otras pérdidas', 4),
('23768af8-0bf5-4919-aa6b-68379f1c8460', 'Docente en la Universidad de Nexum de México', 5);

-- =====================================================

-- 2. MC. PAULINA GÓMEZ GERMÁN
-- ID: ffbc638c-6473-48c7-bab2-1dced7ed48ee

-- Actualizar perfil
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
WHERE id = 'ffbc638c-6473-48c7-bab2-1dced7ed48ee';

-- Insertar credenciales
INSERT INTO public.therapist_credentials (therapist_id, credential_type, title, display_order) VALUES
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Licenciatura', 'Licenciada en Psicología Humanista', 1),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Maestría', 'Máster en Educación de la Sexualidad', 2),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Certificación', 'Terapia Cognitivo Conductual', 3),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Certificación', 'Primeros Auxilios Psicológicos', 4),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Certificación', 'Psicoterapia en línea', 5);

-- Insertar servicios
INSERT INTO public.therapist_services (therapist_id, service_name, description, display_order) VALUES
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Terapia Individual', 'Autoestima, sentido de vida, conflictos de la vida cotidiana. Depresión, ansiedad, TLP, tratamientos con enfoque humanista y cognitivo conductual', 1),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Terapia de Pareja', 'Manejo de conflicto en la pareja, problemas de intimidad, comunicación en la pareja, problemáticas en sexualidad y acompañamiento si hay decisión de separación', 2),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Terapia Sexológica', 'Abuso sexual, disfunciones sexuales, conflictos ligados a la orientación sexual y proceso de transición de género', 3);

-- Insertar áreas de intervención
INSERT INTO public.therapist_interventions (therapist_id, intervention_name, display_order) VALUES
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Ansiedad y depresión', 1),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Abuso sexual', 2),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Proceso de transición de género', 3),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Disfunciones sexuales', 4),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Orientación sexual', 5),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Relación de pareja', 6),
('ffbc638c-6473-48c7-bab2-1dced7ed48ee', 'Problemas familiares', 7);

-- =====================================================

-- 3. DR. JUAN GÓMEZ ALFARO
-- ID: 9dc83bf3-3997-4678-a3f3-d364dde93541

-- Actualizar perfil
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
WHERE id = '9dc83bf3-3997-4678-a3f3-d364dde93541';

-- Insertar credenciales
INSERT INTO public.therapist_credentials (therapist_id, credential_type, title, display_order) VALUES
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Maestría', 'Master en Psicoterapia Gestalt', 1),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Doctorado', 'Doctorado en Psicoterapia Humanista', 2),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Certificación', 'Experiencia en terapia psicológica y primeros auxilios psicológicos en línea', 3);

-- Insertar servicios
INSERT INTO public.therapist_services (therapist_id, service_name, description, display_order) VALUES
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Psicoterapia Profesional', 'Trabajamos la terapia del aquí y el ahora, herramientas cognitivas que ayudan a tener una mejor interpretación de la realidad y el manejo de las emociones', 1),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Coaching de Vida', 'Plan de vida y carrera, desarrollo de potencial y superación bloqueos, claridad de objetivos y logro de metas', 2),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Capacitación Empresarial', 'Asesoria y orientación para grupos de trabajo, comunicación efectiva, liderazgo y manejo de procesos conductuales', 3),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Cursos y Talleres', 'Formación especializada en diferentes áreas de la psicoterapia', 4);

-- Insertar áreas de intervención
INSERT INTO public.therapist_interventions (therapist_id, intervention_name, display_order) VALUES
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Ansiedad y depresión', 1),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Duelos', 2),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Asuntos de pareja', 3),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Proyectos de vida', 4),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Trastornos psicológicos', 5),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Adolescentes y jóvenes', 6),
('9dc83bf3-3997-4678-a3f3-d364dde93541', 'Comunicación y liderazgo', 7);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver perfiles actualizados
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
WHERE p.id IN (
  '23768af8-0bf5-4919-aa6b-68379f1c8460',
  'ffbc638c-6473-48c7-bab2-1dced7ed48ee',
  '9dc83bf3-3997-4678-a3f3-d364dde93541'
)
ORDER BY p.full_name;
