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

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                sh '''
                gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                gcloud config set project sonorous-guide-471513-h8
                gcloud container clusters get-credentials cluster --zone us-central1-a --project sonorous-guide-471513-h8
                kubectl apply -f K8s/deployment.yaml
                kubectl apply -f K8s/service.yaml
                '''
        }
    }
}
        
    }
} 
