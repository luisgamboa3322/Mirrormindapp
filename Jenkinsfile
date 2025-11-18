pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
               
                bat 'call npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Construyendo la aplicación...'
                bat 'call npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Ejecutando pruebas...'
               
                bat 'set CI=true && call npm test' 
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Simulando despliegue...'
             
                bat 'echo La aplicación ha sido construida y probada con éxito.'
            }
        }
    }
    
    post {
        success {
            echo '¡El Pipeline terminó correctamente!'
           
            archiveArtifacts artifacts: 'build/**/*', fingerprint: true
        }
        failure {
            echo 'Algo salió mal '
        }
    }
}
