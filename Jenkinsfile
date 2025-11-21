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
                withCredentials([file(credentialsId: 'gcp-key', variable: 'Google-application-credential')]) {
    
                sh '''
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                '''
                
            }
                } 

            }
        

    
    }
} 
