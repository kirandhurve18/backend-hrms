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
                    # Stop old container if running
                    docker rm -f ${CONTAINER_NAME} || true

                    # Run new container
                    docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE_NAME}:latest
                """
            }
        }
    
    }
}
