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
                sh 'npm install'
                sh 'electron-builder -lw'
            }
         }
    }
    post{
        always{
            archiveArtifacts artifacts: 'build/*.tar.gz', allowEmptyArchive: true, fingerprint: true
            archiveArtifacts artifacts: 'build/*.exe', allowEmptyArchive: true, fingerprint: true
			archiveArtifacts artifacts: 'build/*.AppImage', allowEmptyArchive: true, fingerprint: true
        }
    }
}
