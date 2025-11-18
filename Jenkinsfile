pipeline {
    agent any


    environment {

        NETLIFY_AUTH_TOKEN = 'nfp_389FBTWXHz2YDQVfqgbppfgE6tZ2U92T70bf'
        

        NETLIFY_SITE_ID = '521a2993-5862-4d1d-9dfc-9c1d3e9f2102'
    }

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


        stage('Deploy to Cloud') {
            steps {
                echo ' Desplegando a la Nube de Netlify...'
 
                bat 'netlify deploy --dir=build --prod'
            }
        }
    }
    
    post {
        success {
            echo ' ¡Felicidades! Tu app ya está visible en internet.'
   
            archiveArtifacts artifacts: 'build/**/*', fingerprint: true
        }
        failure {
            echo ' Algo falló en el despliegue.'
        }
    }
}
