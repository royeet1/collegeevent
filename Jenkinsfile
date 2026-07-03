pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Spring Boot') {
            steps {
                bat '.\\mvnw.cmd clean package'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" build -t collegeevent:v1 .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\kubectl.exe" apply -f k8s\\deployment.yaml'
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\kubectl.exe" apply -f k8s\\service.yaml'
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\kubectl.exe" rollout restart deployment/collegeevent-deployment'
            }
        }
    }

    post {
        success {
            echo 'College Event Website deployed successfully!'
        }

        failure {
            echo 'Build failed. Please check the console output.'
        }
    }
}