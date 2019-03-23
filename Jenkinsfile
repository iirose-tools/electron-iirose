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
                sh 'electron-builder -mlw'
            }
         }
    }
    post{
        always{
            archiveArtifacts artifacts: 'build/*.tar.gz', fingerprint: true
            archiveArtifacts artifacts: 'build/*.exe', fingerprint: true
			archiveArtifacts artifacts: 'build/*.dmg', fingerprint: true
			archiveArtifacts artifacts: 'build/*.AppImage', fingerprint: true
        }
    }
}
