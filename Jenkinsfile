pipeline {
    agent any
    environment {
        IMAGE_NAME = "myimage"
        CONTAINER_NAME = "backend-container"
    }

    stages {
        stage('pull'){
            steps {
                git branch: 'main', credentialsId: 'git-C', url: 'https://github.com/kirandhurve18/backend-hrms.git'
            }
        }
    
        stage('Build Docker Image') {
            steps {
                script {
                   docker.build(IMAGE_NAME)
                }
            }
        }

        stage('Docker Login') {
            steps {
                 withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKERHUB_TOKEN')]) {
                 sh '''
                echo "$DOCKERHUB_TOKEN" | docker login -u "kirand18" --password-stdin
               '''
            }
        }
} 

        stage('Push to DockerHub') {
            steps {
             sh '''
             docker tag myimage:latest kirand18/dockerrepo:latest
             docker push kirand18/dockerrepo:latest
             '''
    }
}
        stage('deploy'){
            steps{
                sh """
                    docker rm -f backend-container || true
                    docker pull kirand18/dockerrepo:latest
                    docker run -d --name backend-container -p 3005:3005 kirand18/dockerrepo:latest
                """
            }
        }

    
    }
} 
