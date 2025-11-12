import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Shield,
  Target,
  TrendingUp,
  Users,
  FileText,
  Bell,
  BarChart3,
  Zap,
  DollarSign,
  Star
} from "lucide-react";

interface IncidentManagementScreenProps {
  onBack: () => void;
}

export function IncidentManagementScreen({ onBack }: IncidentManagementScreenProps) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 -ml-2 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h2 className="mb-2">Gestión de Incidencias</h2>
        <p className="text-orange-100">
          Método y herramientas para el Proyecto MirrorMind
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Methodology Section */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-3 mb-4">
            <Target className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="mb-2">Método de Gestión de Incidencias</h3>
              <p className="text-sm text-muted-foreground">
                Basado en PMBOK - Gestión de Problemas e Incidentes
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <MethodStep 
              number={1}
              title="Identificación y Registro"
              description="Detectar y documentar el incidente con toda la información relevante (descripción, impacto, prioridad, fecha/hora)."
            />
            <MethodStep 
              number={2}
              title="Categorización y Priorización"
              description="Clasificar el incidente según su tipo, severidad y urgencia. Asignar prioridad basada en el impacto en el proyecto."
            />
            <MethodStep 
              number={3}
              title="Análisis e Investigación"
              description="Investigar la causa raíz del problema. Involucrar a los miembros del equipo especializados según el área afectada."
            />
            <MethodStep 
              number={4}
              title="Resolución y Corrección"
              description="Implementar solución, asignar responsables y establecer cronograma de resolución. Aplicar plan de contingencia si es necesario."
            />
            <MethodStep 
              number={5}
              title="Cierre y Documentación"
              description="Verificar que el incidente está resuelto, documentar lecciones aprendidas y actualizar la base de conocimiento."
            />
            <MethodStep 
              number={6}
              title="Seguimiento y Mejora Continua"
              description="Analizar tendencias, prevenir recurrencias y optimizar el proceso de gestión de incidencias."
            />
          </div>
        </Card>

        {/* Tool Section */}
        <div>
          <h3 className="mb-4">Herramienta Recomendada</h3>
          
          <Card className="overflow-hidden">
            {/* Tool Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2>Jira Software</h2>
                  <p className="text-sm text-blue-100">by Atlassian</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Líder del mercado
                </Badge>
                <Badge className="bg-blue-800 text-white border-0">
                  PMBOK Compatible
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4>Descripción</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Jira es una plataforma de gestión de proyectos e incidencias líder en la industria, 
                  diseñada para equipos ágiles y tradicionales. Permite rastrear bugs, tareas, historias 
                  de usuario e incidentes desde su creación hasta su resolución. Ofrece flujos de trabajo 
                  personalizables, tableros Kanban/Scrum, seguimiento en tiempo real y potentes 
                  capacidades de reporte que se alinean perfectamente con las mejores prácticas del PMBOK.
                </p>
              </div>

              <Separator />

              {/* Cost */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h4>Costo</h4>
                </div>
                <div className="space-y-3">
                  <PricingTier 
                    name="Free"
                    price="$0"
                    description="Hasta 10 usuarios"
                    features={["Tableros ilimitados", "Almacenamiento 2GB", "Soporte comunitario"]}
                  />
                  <PricingTier 
                    name="Standard"
                    price="$7.75"
                    period="/usuario/mes"
                    description="Para equipos en crecimiento"
                    features={["Hasta 35,000 usuarios", "250GB almacenamiento", "Soporte 24/7"]}
                    recommended
                  />
                  <PricingTier 
                    name="Premium"
                    price="$15.25"
                    period="/usuario/mes"
                    description="Para equipos grandes"
                    features={["Usuarios ilimitados", "Almacenamiento ilimitado", "Soporte prioritario"]}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  💡 <strong>Recomendación para MirrorMind:</strong> El plan Free es suficiente para nuestro 
                  equipo de 7 personas durante la fase de prototipo.
                </p>
              </div>

              <Separator />

              {/* Main Features */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h4>Características Principales</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <FeatureCard 
                    icon={<BarChart3 className="w-5 h-5" />}
                    title="Seguimiento de Incidentes"
                    description="Registro detallado de bugs, problemas y tareas con campos personalizables, adjuntos, comentarios y historial completo."
                  />
                  <FeatureCard 
                    icon={<Users className="w-5 h-5" />}
                    title="Flujos de Trabajo Personalizables"
                    description="Crea flujos adaptados a tu proceso: Nuevo → En Análisis → En Progreso → En Pruebas → Resuelto → Cerrado."
                  />
                  <FeatureCard 
                    icon={<TrendingUp className="w-5 h-5" />}
                    title="Priorización Inteligente"
                    description="Sistema de prioridades (Crítico, Alto, Medio, Bajo) con etiquetas de severidad e impacto alineadas a PMBOK."
                  />
                  <FeatureCard 
                    icon={<Bell className="w-5 h-5" />}
                    title="Notificaciones y Alertas"
                    description="Alertas automáticas por email y en la plataforma para mantener al equipo informado en tiempo real."
                  />
                  <FeatureCard 
                    icon={<BarChart3 className="w-5 h-5" />}
                    title="Reportes y Dashboards"
                    description="Visualización de métricas clave: tiempo de resolución, incidentes por prioridad, tendencias, burndown charts."
                  />
                  <FeatureCard 
                    icon={<FileText className="w-5 h-5" />}
                    title="Integración y Documentación"
                    description="Integración con GitHub, Slack, Confluence. Base de conocimiento para documentar soluciones y lecciones aprendidas."
                  />
                  <FeatureCard 
                    icon={<Clock className="w-5 h-5" />}
                    title="SLA y Tiempo de Respuesta"
                    description="Configuración de acuerdos de nivel de servicio y seguimiento de tiempos de respuesta y resolución."
                  />
                  <FeatureCard 
                    icon={<Target className="w-5 h-5" />}
                    title="Tableros Ágiles"
                    description="Tableros Kanban y Scrum con drag-and-drop para gestión visual del progreso de incidentes."
                  />
                </div>
              </div>

              <Separator />

              {/* Real Case Application */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4>Caso Real de Aplicación en MirrorMind</h4>
                </div>
                
                <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm mb-2">Escenario de Incidente</h4>
                      <p className="text-sm text-muted-foreground">
                        Durante las pruebas del prototipo, el tester Adrián detecta que el módulo de análisis 
                        facial no procesa correctamente las imágenes en dispositivos Android con cámara de baja 
                        resolución, afectando al 30% de los casos de prueba.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  <CaseStep 
                    step="1. Registro en Jira"
                    description="Adrián crea un ticket con tipo 'Bug', prioridad 'Alta', asigna a Jair Vásquez (Especialista IA) y adjunta capturas de pantalla y logs."
                    status="completed"
                  />
                  <CaseStep 
                    step="2. Categorización"
                    description="El sistema automáticamente categoriza como 'Módulo: Análisis Facial' y 'Componente: Procesamiento de Imagen'. Se etiqueta 'Android' y 'Performance'."
                    status="completed"
                  />
                  <CaseStep 
                    step="3. Análisis Técnico"
                    description="Jair investiga y comenta en el ticket que el modelo de IA requiere una imagen mínima de 720p. Propone implementar un pre-procesador de upscaling."
                    status="completed"
                  />
                  <CaseStep 
                    step="4. Desarrollo de Solución"
                    description="Alejandro Magno (Desarrollador) recibe la asignación, implementa el pre-procesador, actualiza el estado a 'En Revisión' y vincula el commit de GitHub."
                    status="in-progress"
                  />
                  <CaseStep 
                    step="5. Testing y Validación"
                    description="Adrián re-testea con dispositivos afectados, verifica que el bug está resuelto y cambia el estado a 'Resuelto'."
                    status="pending"
                  />
                  <CaseStep 
                    step="6. Documentación"
                    description="Chopitea documenta la solución en Confluence (integrado con Jira) para referencia futura. El ticket se cierra con lecciones aprendidas."
                    status="pending"
                  />
                </div>

                <Card className="p-4 bg-blue-50 border-blue-200 mt-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm mb-2">Beneficios Obtenidos</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <BenefitPoint text="Trazabilidad completa del incidente desde detección hasta resolución" />
                        <BenefitPoint text="Colaboración eficiente entre roles (Tester → IA Specialist → Developer)" />
                        <BenefitPoint text="Métricas de tiempo: el incidente se resolvió en 2 días vs. objetivo de 3 días" />
                        <BenefitPoint text="Base de conocimiento actualizada para prevenir incidentes similares" />
                        <BenefitPoint text="Reporte generado para la retrospectiva del sprint" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>

        {/* PMBOK Alignment */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <h4 className="mb-3">Alineación con PMBOK</h4>
              <p className="text-sm text-muted-foreground mb-4">
                La gestión de incidencias con Jira se alinea con las siguientes áreas de conocimiento del PMBOK:
              </p>
              <div className="space-y-2">
                <PMBOKAlignment area="Gestión de la Calidad" description="Identificación y corrección de defectos" />
                <PMBOKAlignment area="Gestión de Riesgos" description="Respuesta a problemas e incidentes imprevistos" />
                <PMBOKAlignment area="Gestión de las Comunicaciones" description="Registro y comunicación de problemas al equipo" />
                <PMBOKAlignment area="Gestión del Cronograma" description="Impacto de incidentes en tiempos del proyecto" />
                <PMBOKAlignment area="Gestión de los Recursos" description="Asignación de personal para resolver incidentes" />
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-4">
          <p>Documentación del Proyecto MirrorMind</p>
          <p className="mt-1">Metodología PMBOK • Gestión de Incidencias</p>
        </div>
      </div>
    </div>
  );
}

interface MethodStepProps {
  number: number;
  title: string;
  description: string;
}

function MethodStep({ number, title, description }: MethodStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface PricingTierProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

function PricingTier({ name, price, period, description, features, recommended }: PricingTierProps) {
  return (
    <div className={`p-4 rounded-lg border ${recommended ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm">{name}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {recommended && <Badge className="bg-blue-600 text-white border-0">Recomendado</Badge>}
      </div>
      <div className="mb-3">
        <span className="text-2xl">{price}</span>
        {period && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>
      <div className="space-y-1">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border bg-gray-50">
      <div className="flex-shrink-0 text-blue-600 mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface CaseStepProps {
  step: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
}

function CaseStep({ step, description, status }: CaseStepProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-0.5">
        {getStatusIcon()}
      </div>
      <div className="flex-1">
        <h4 className="text-sm mb-1">{step}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface BenefitPointProps {
  text: string;
}

function BenefitPoint({ text }: BenefitPointProps) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
      <span className="text-xs">{text}</span>
    </div>
  );
}

interface PMBOKAlignmentProps {
  area: string;
  description: string;
}

function PMBOKAlignment({ area, description }: PMBOKAlignmentProps) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
      <div>
        <span className="font-medium">{area}:</span>{' '}
        <span className="text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}
