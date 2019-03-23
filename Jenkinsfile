pipeline {
    agent { label 'Theresa Japan Server' }

    stages {
        stage('Pre-Build'){
            steps {
                sh 'rm -rf ./build || true'
            }
        }
        stage('Build') {
            steps {
                sh 'electron-builder -wl tar.gz --publish never'
            }
         }
    }
    post{
        always{
            archiveArtifacts artifacts: 'build/*.tar.gz', fingerprint: true
            archiveArtifacts artifacts: 'build/*.exe', fingerprint: true
        }
    }
}
