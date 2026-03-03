# 📦 Gestion Stock – Application de Gestion de Stock avec Authentification

## 📝 Description du projet

**Gestion Stock** est une application web complète permettant la gestion des produits, des catégories, des fournisseurs et des mouvements de stock, avec un système d’authentification intégré.

L’application est basée sur une architecture moderne **Backend + Frontend séparés** :

* 🔙 Backend : **Spring Boot**
* 🎨 Frontend : **Angular**
* 🗄 Base de données : **MySQL**

Elle permet de gérer efficacement les entrées et sorties de stock tout en garantissant la traçabilité et la sécurité des données.

---

# 🎯 Objectifs

* ✅ Suivre les entrées et sorties de produits
* ✅ Gérer les catégories et les fournisseurs
* ✅ Assurer la traçabilité des mouvements de stock
* ✅ Sécuriser l’accès via un système d’authentification
* ✅ Fournir une interface moderne et responsive
* ✅ Garantir l’intégrité des données

---

# 🏗 Architecture Technique

## 🔙 Backend

* **Langage** : Java 17+
* **Framework** : Spring Boot 3.5.6
* **Build Tool** : Maven
* **ORM** : Spring Data JPA (Hibernate)
* **Base de données** : MySQL
* **Validation** : Jakarta Validation
* **Architecture** :

  ```
  Controller → Service → Repository → Entity
  ```
* **Authentification** :

  * Token UUID (version actuelle)
  * Évolution prévue : JWT + Spring Security

---

## 🎨 Frontend

* **Framework** : Angular 15+
* **HTTP Client** pour communication API
* **AuthGuard** pour protéger les routes
* **HTTP Interceptor** pour ajouter automatiquement le token
* **Bootstrap** pour le design
* **Routing Angular** pour la navigation

---

# 👥 Acteurs

| Acteur                            | Description                         |
| --------------------------------- | ----------------------------------- |
| Utilisateur non authentifié       | Peut s’inscrire et se connecter     |
| Utilisateur authentifié           | Accède à toutes les fonctionnalités |
| Administrateur (évolution future) | Gestion des rôles et permissions    |

---

# 🔐 Module d’Authentification

## Fonctionnalités

* ✔ Inscription
* ✔ Connexion
* ✔ Déconnexion
* ✔ Vérification disponibilité username/email
* ✔ Gestion des utilisateurs (CRUD)

## 📡 Endpoints

| Méthode | URL                                   |
| ------- | ------------------------------------- |
| POST    | `/api/auth/register`                  |
| POST    | `/api/auth/login`                     |


---

# 📦 Module de Gestion de Stock

---

## 🗂 1. Catégories

### Fonctionnalités

* Liste paginée
* Ajout
* Modification
* Suppression (si aucune dépendance)

### Endpoints

```
GET    /api/categories
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

---

## 🏢 2. Fournisseurs

### Fonctionnalités

* Gestion complète des fournisseurs
* Validation email
* Suppression si non lié à un produit

### Endpoints

```
GET    /api/suppliers
GET    /api/suppliers/{id}
POST   /api/suppliers
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}
```

---

## 📦 3. Produits

### Fonctionnalités

* Gestion complète
* Filtrage par catégorie
* Filtrage par fournisseur
* Consultation historique des mouvements

### Endpoints

```
GET    /api/products
GET    /api/products/{id}
GET    /api/products/by-category/{categoryId}
GET    /api/products/by-supplier/{supplierId}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

---

## 🔄 4. Mouvements de Stock

### Types

* **ENTREE**
* **SORTIE**

### Règles importantes

* ✔ Mise à jour automatique du stock
* ✔ Vérification stock suffisant pour SORTIE
* ❌ Modification interdite
* ✔ Suppression annule l’effet sur le stock

### Endpoints

```
GET    /api/stock-movements
GET    /api/stock-movements/{id}
GET    /api/stock-movements/by-product/{productId}
POST   /api/stock-movements
DELETE /api/stock-movements/{id}
```

---

# 🗄 Structure de la Base de Données

### 📌 users

* id
* username (unique)
* password
* email (unique)
* full_name
* phone

### 📌 categories

* id
* name
* description
* created_at

### 📌 suppliers

* id
* name
* email
* phone
* address
* created_at

### 📌 products

* id
* name
* description
* price
* quantity
* category_id (FK)
* supplier_id (FK)
* created_at

### 📌 stock_movements

* id
* product_id (FK)
* type
* quantity
* reason
* movement_date

---

# 🚀 Installation et Lancement

## 🔙 Backend

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/laminethiam02/gestion_stock_springBoot_Angular.git
cd gestion-stock
```

### 2️⃣ Configurer MySQL

Créer une base :

```sql
CREATE DATABASE dbcompletstock;
```

Modifier `application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dbcompletstock
spring.datasource.username=root
spring.datasource.password=motdepasse
spring.jpa.hibernate.ddl-auto=update
```

### 3️⃣ Lancer le backend

```bash
mvn clean install
mvn spring-boot:run
```

Backend disponible sur :

```
http://localhost:8080
```

---

## 🎨 Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend disponible sur :

```
http://localhost:4200
```

---

# 🔒 Contraintes de Sécurité

⚠ Actuellement (version pédagogique) :

* Mot de passe stocké en clair
* Token simple UUID



---

# 🧪 Critères de Validation

Le projet est validé si :

* ✔ L’utilisateur peut s’inscrire et se connecter
* ✔ Toutes les opérations CRUD fonctionnent
* ✔ Le stock est automatiquement mis à jour
* ✔ La suppression d’un mouvement annule correctement son effet
* ✔ Les données sont persistées correctement
* ✔ L’interface est fonctionnelle



