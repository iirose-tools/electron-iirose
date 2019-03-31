pipeline {
    agent { label 'Theresa Japan Server' }

    stages {
        stage('Pre-Build'){
            steps {
                sh 'rm -rf ./build || true'
                sh 'git submodule init'
                sh 'git submodule update'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'cd iirose-bot-ts && npm install && (tsc --build tsconfig.json || true)'
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
