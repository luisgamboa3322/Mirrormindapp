pipeline {
    agent any
    stages {
        stage('Build'){
            steps {
                echo "etapa BUILD no disponible"
            }
        }
        stage('Test'){
            steps {
                echo"etapa TEST no disponible"

    }
}
stage('Deploy'){
    steps {
        sh "docker-compose down -v"
        sh "docker-compose up -d --build"
    }
}
    }
}
