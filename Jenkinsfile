pipeline {
    agent any
    stages {
        stage('pull'){
            steps {
                git branch: 'main', url: 'https://github.com/kirandhurve18/backend-hrms.git'
            }
        }
    
        stage('Build Docker Image') {
            steps {
                script {
                   docker.build("myimage")
                }
            }
        }
        stage('Run New Container') {
            steps {
                sh """
                    docker run -d --name ${backendcont} -p 3000:3000 ${myimage}:latest
                """
            }
        }
    
    }
}
