
````markdown
# ⚔️ Cleaner Bot

Un bot Discord **en NodeJS (Discord.js v14)** avec des commandes de gestion puissantes (⚠️ à utiliser avec prudence).  
Toutes les réponses se font en **embed**, avec un style propre et lisible.

---

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/tonpseudo/raid-bot.git
   cd raid-bot
````

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer le bot**

   * Renomme/édite le fichier `config.json`
   * Exemple :

     ```json
     {
       "token": "TON_TOKEN_ICI",
       "prefix": "*",
       "status": "d34fr",
       "color": "#ff0000",
       "footer": "34Press | Bot RAID",
       "sys": ["ID_TON_SYS"],
       "owners": ["ID_TON_OWNER"]
     }
     ```

4. **Lancer le bot**

   ```bash
   npm start
   ```

---

## ⚙️ Commandes disponibles

### 🔨 Admin / Owner / Sys+

* `*dcall` → Supprime **tous** les salons puis recrée un salon accessible.
* `*dc <Nom>` → Supprime les salons contenant `<Nom>` dans leur nom.
* `*dr` → Supprime **tous** les rôles.
* `*dr <Nom>` → Supprime les rôles contenant `<Nom>`.
* `*rename` → Réinitialise les pseudos des membres.
* `*unbanall` → Débannit tous les bannis.
* `*dero` → Reset les permissions de @everyone avec des perms de base.
* `*owner <user>` → Ajoute un owner ou affiche la liste.
* `*clear` → Supprime **tous** les messages du salon actuel.
* `*tempo` → Crée un salon temporaire accessible par tous.

### 📖 Everyone

* `*help` → Affiche la liste des commandes.

---

## 📌 Configuration

* **Prefix** → `*` (modifiable dans `config.json`)
* **Sys+** → Liste d’IDs d’admins supérieurs avec contrôle total.
* **Owners** → Liste d’IDs considérés comme propriétaires du bot.
* **Statut** → Mode `streaming` personnalisé, configurable.

---

## 🛠️ Dépendances

* [discord.js v14](https://discord.js.org/)

---

## ⚠️ Avertissement

> Ce bot contient des commandes destructrices (suppression de salons, rôles, etc.).
> Utilisez-le uniquement dans des environnements **autorisés** (tests, serveurs privés).
> **Je ne suis pas responsable d’un mauvais usage.**

````
