pipeline {
    agent {
        docker { image 'node:20' } // Node.js environment for build
    }
    
    stages {
        stage('pull') {
            steps {
                git branch: 'main', credentialsId: 'git-C', url: 'https://github.com/kirandhurve18/backend-hrms.git'
            }
        }

        stage('Clean') {
            steps {
                sh '''
                  rm -rf node_modules package-lock.json
                 '''
                }
            }
    
        stage('Build') {
            steps { 
                withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKERHUB_TOKEN')]) {
                sh '''
                docker build -t myimage:latest .
                echo "$DOCKERHUB_TOKEN" | docker login -u "kirand18" --password-stdin
                docker tag myimage:latest kirand18/dockerrepo:latest
                docker push kirand18/dockerrepo:latest
                '''
                }                
            }
        }   
       
        stage('Deploy') {
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

