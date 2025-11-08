TP — Déploiement CI/CD Frontend React & Backend Node.js
📋 Table des matières

Vue d'ensemble
Architecture de déploiement
URLs de production
Stack technique
Configuration CI/CD
Secrets GitHub
Processus de déploiement
Gestion PM2
Rollback et récupération
Journal de déploiement
Validation et tests


🎯 Vue d'ensemble
Ce projet implémente une pipeline CI/CD complète pour déployer automatiquement :

Un frontend React (Vite + TypeScript) sur un VPS personnel
Un backend Node.js/Express sur Render

Contrainte respectée : Aucune modification du code applicatif (frontend/backend). Toute la configuration de déploiement est externalisée.

🏗️ Architecture de déploiement
┌─────────────────┐
│  GitHub Actions │
│    (CI/CD)      │
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌────────────────┐    ┌───────────────┐
│  VPS (Nginx)   │    │    Render     │
│   Frontend     │◄───┤   Backend     │
│   + PM2        │    │   (Node.js)   │
└────────────────┘    └───────────────┘
        │
        ▼
┌────────────────┐
│   Let's Encrypt│
│   SSL/TLS      │
└────────────────┘
Composants

GitHub Actions : Orchestration CI/CD
VPS (marc-antoinemarie.com) :

Nginx pour servir le frontend
PM2 pour la gestion du processus
SSL/TLS via Let's Encrypt


Render : Hébergement backend avec déploiement automatique


🌐 URLs de production
ServiceURLDescriptionFrontendhttps://api-jeu-main.marc-antoinemarie.comInterface d'administration ReactBackendhttps://api-jeu-main-1.onrender.comAPI REST Node.jsGitHubhttps://github.com/Marc-AntoineMarie/API_Jeu-mainDépôt source

🛠️ Stack technique
Frontend

Framework : React 18
Build tool : Vite
Language : TypeScript
Serveur : Nginx (reverse proxy)
Process Manager : PM2

Backend

Runtime : Node.js 20
Framework : Express.js
Hébergement : Render
Database : (selon configuration backend)

DevOps

CI/CD : GitHub Actions
Transfert : rsync via SSH
SSL : Let's Encrypt (Certbot)
Monitoring : PM2


⚙️ Configuration CI/CD
Triggers
La pipeline s'exécute automatiquement sur :
yamlon:
  push:
    branches:
      - main
Pipeline (3 jobs)
1. build-frontend

Checkout du code
Installation des dépendances (npm ci)
Build du frontend (npm run build)
Upload de l'artefact admin-dashboard/dist

Durée moyenne : ~2-3 minutes
2. deploy-frontend

Téléchargement de l'artefact
Configuration SSH avec clé privée
Synchronisation via rsync vers le VPS
Rechargement du processus PM2

Durée moyenne : ~30 secondes
3. deploy-backend

Déclenchement du webhook Render
Render reconstruit et redéploie automatiquement

Durée moyenne : ~3-5 minutes (côté Render)

🔐 Secrets GitHub
Les secrets suivants sont configurés dans Settings > Secrets and variables > Actions :
SecretDescriptionExempleVPS_HOSTAdresse IP ou hostname du VPSvps-8ca4a325.vps.ovh.caVPS_USERUtilisateur SSHdebianVPS_PORTPort SSH22VPS_SSH_KEYClé privée SSH (format PEM)-----BEGIN OPENSSH PRIVATE KEY-----...VPS_KNOW_HOST(Optionnel) Fingerprint SSHGénéré automatiquement par ssh-keyscanRENDER_DEPLOY_HOOK_URLURL du webhook Renderhttps://api.render.com/deploy/srv-...
Configuration des secrets
bash# Génération de la clé SSH (si nécessaire)
ssh-keygen -t ed25519 -C "github-actions@deploy"

# Copie de la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 22 debian@vps-8ca4a325.vps.ovh.ca

# Récupération du webhook Render
# Dashboard Render > Service > Settings > Deploy Hook

🚀 Processus de déploiement
Flux complet (push sur main)

Développeur push sur la branche main
GitHub Actions déclenche la pipeline
Build frontend :

Installation des dépendances
Compilation TypeScript/Vite
Génération du bundle optimisé


Deploy frontend :

Téléchargement de l'artefact
Synchronisation via rsync (delta uniquement)
Rechargement PM2 sans interruption


Deploy backend :

Appel du webhook Render
Render pull, build et redéploie



Temps d'indisponibilité

Frontend : 0 seconde (PM2 reload graceful)
Backend : ~10-30 secondes (lors du redéploiement Render)


🔄 Gestion PM2
Configuration PM2 sur le VPS
bash# Processus actuel
pm2 list
┌────┬──────────────────┬──────┬──────┬───────────┬──────────┬──────────┐
│ id │ name             │ mode │ ↺    │ status    │ cpu      │ memory   │
├────┼──────────────────┼──────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ API_Jeu_main     │ fork │ 0    │ online    │ 0%       │ 28.2mb   │
└────┴──────────────────┴──────┴──────┴───────────┴──────────┴──────────┘
Commandes PM2 utiles
bash# Recharger l'application (zero-downtime)
pm2 reload API_Jeu_main

# Voir les logs en temps réel
pm2 logs API_Jeu_main

# Redémarrer (avec downtime)
pm2 restart API_Jeu_main

# Arrêter
pm2 stop API_Jeu_main

# Supprimer
pm2 delete API_Jeu_main

# Sauvegarder la configuration
pm2 save

# Auto-démarrage au boot
pm2 startup
Configuration Nginx
Fichier : /etc/nginx/sites-available/API_Jeu_main.conf
nginxserver {
    listen 80;
    listen [::]:80;
    server_name api-jeu-main.marc-antoinemarie.com;
    
    root /var/www/API_Jeu_main_front_build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Certificat SSL géré par Certbot
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api-jeu-main.marc-antoinemarie.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api-jeu-main.marc-antoinemarie.com/privkey.pem;
}

🔙 Rollback et récupération
En cas d'échec de déploiement
Option 1 : Redéployer le commit précédent
bash# Localement
git revert HEAD
git push origin main

# Ou réinitialiser à un commit spécifique
git reset --hard <commit-hash>
git push --force origin main
Option 2 : Rollback manuel sur le VPS
bash# Se connecter au VPS
ssh debian@vps-8ca4a325.vps.ovh.ca

# Restaurer depuis une sauvegarde
sudo cp -r /var/www/API_Jeu_main_front_build_backup/* /var/www/API_Jeu_main_front_build/

# Recharger PM2
pm2 reload API_Jeu_main
Option 3 : Rollback Render
bash# Via le dashboard Render
# Deploy > Events > Rollback to <previous-deployment>
Stratégie de sauvegarde recommandée
bash# Avant chaque déploiement (à automatiser)
ssh debian@vps-8ca4a325.vps.ovh.ca "cp -r /var/www/API_Jeu_main_front_build /var/www/API_Jeu_main_front_build_backup_$(date +%Y%m%d_%H%M%S)"

**Downtime** : ...

✅ Validation et tests
Check-list de validation

 Les secrets CI sont créés et ne sont jamais committés
 Le build du frontend est produit en CI
 Seul l'artefact de build est déployé sur le VPS
 Le déploiement Render est déclenché depuis la CI
 PM2 relance le service frontend après synchronisation
 Un push sur main déclenche la mise à jour des deux cibles
 Le README explique le rollback et la consultation des logs
 Certificat SSL valide et configuré
 Nginx correctement configuré

Tests post-déploiement
bash# 1. Vérifier que le frontend répond
curl -I https://api-jeu-main.marc-antoinemarie.com
# Attendu : HTTP/1.1 200 OK

# 2. Vérifier que le backend répond
curl -I https://api-jeu-main-1.onrender.com
# Attendu : HTTP/1.1 200 OK

# 3. Vérifier PM2 sur le VPS
ssh debian@vps-8ca4a325.vps.ovh.ca "pm2 status"
# Attendu : API_Jeu_main online

# 4. Vérifier les logs
ssh debian@vps-8ca4a325.vps.ovh.ca "pm2 logs API_Jeu_main --lines 50"

# 5. Tester l'application complète
# Ouvrir https://api-jeu-main.marc-antoinemarie.com/login dans un navigateur
Consultation des logs
bash# Logs GitHub Actions
# Aller sur : https://github.com/Marc-AntoineMarie/API_Jeu-main/actions

# Logs PM2 sur le VPS
ssh debian@vps-8ca4a325.vps.ovh.ca "pm2 logs API_Jeu_main"

# Logs Nginx sur le VPS
ssh debian@vps-8ca4a325.vps.ovh.ca "sudo tail -f /var/log/nginx/access.log"

# Logs Render
# Dashboard Render > Logs tab

🔧 Dépannage
Problème : Le build échoue
Symptôme : Erreur dans l'étape build-frontend
Solution :
bash# Tester localement
cd admin-dashboard
npm ci
npm run build

# Vérifier les versions Node.js
node --version  # Doit être >= 20
Problème : Rsync échoue
Symptôme : Permission denied ou Connection refused
Solution :
bash# Vérifier la connectivité SSH
ssh -p 22 debian@vps-8ca4a325.vps.ovh.ca

# Vérifier les permissions sur le VPS
ssh debian@vps-8ca4a325.vps.ovh.ca "ls -la /var/www/API_Jeu_main_front_build"

# Si nécessaire, ajuster les permissions
ssh debian@vps-8ca4a325.vps.ovh.ca "sudo chown -R debian:debian /var/www/API_Jeu_main_front_build"
Problème : PM2 ne redémarre pas
Symptôme : Le processus PM2 n'est pas trouvé
Solution :
bash# Démarrer manuellement
ssh debian@vps-8ca4a325.vps.ovh.ca
pm2 start serve --name API_Jeu_main --spa /var/www/API_Jeu_main_front_build 5173
pm2 save
Problème : Le webhook Render ne se déclenche pas
Symptôme : Le backend ne se met pas à jour
Solution :
bash# Tester le webhook manuellement
curl -X POST $RENDER_DEPLOY_HOOK_URL

📚 Ressources

Documentation GitHub Actions
Documentation PM2
Documentation Render
Documentation Nginx
Let's Encrypt - Certbot


👥 Contributeurs

Développeur : Marc-Antoine Marie
Hébergement VPS : OVH
Hébergement Backend : Render


📄 Licence
Ce projet est réalisé dans le cadre d'un TP académique.
