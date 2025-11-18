pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                echo ' Instalando dependencias...'
                bat 'call npm install'
            }
        }

        stage('Build') {
            steps {
                echo ' Construyendo la aplicación...'
                bat 'call npm run build'
            }
        }

       
        
        stage('Deploy Simulation') {
            steps {
                echo '🚀 Simulando despliegue...'
           
                bat 'echo La aplicación está lista para producción.'
            }
        }
    }
    
    post {
        success {
            echo ' ¡Pipeline completado con éxito!'
           
            archiveArtifacts artifacts: 'build/**/*', fingerprint: true
        }
        failure {
            echo ' Algo falló en el proceso.'
        }
    }
}
