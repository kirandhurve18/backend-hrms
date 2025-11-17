pipeline {
    agent any
    stages {
        stage('pull'){
            steps {
                git branch: 'main', url: 'https://github.com/kirandhurve18/backend-hrms.git'
            }
        }
    }
}

       stage('Build Docker Image') {
            steps {
                script {
                   docker.build("myimage")
                }
            }
        }
    }
}
