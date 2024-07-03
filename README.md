# Get started

version de NodeJs recommendé 20.xxx (j'ai utilisé la version 20.6.1).

Installer le projet: `npm i --force` (j'ai un conflit entre différentes lib, je n'ai pas pris le temps de regarder, mais je m'occupe souvent de corriger le genre de problème).

Ouvrir 2 terminaux de commande depuis la racine du projet.
Et lancer les commandes
`nx serve blog-api`
`nx serve blog`

# Commentaires sur le projet

Par manque de temps libre:
-Je n'ai pas mis en place la gestion d'un utilisateur (le modifier, le supprimer), on peut simplement en créer un.

- Je n'ai pas mis en place la gestion des dernières activités. Mais j'avais préparé le terrain, j'ai mis en place un champ updatedAt dans les tables Articles et Commentaires pour pouvoir récupérer les dernières activités.

- Je n'ai pas packagé l'application, j'ai essayé rapidement de mettre Docker, mais j'ai pas réussi à finir de corriger un soucis avec Prisma (manque de temps). Je n'ai pas non plus configuré l'application pour qu'elle soit correctement câblé lorsque l'on utlise la version de prod, seul la version de développement en local fonctionne.

- Je n'ai pas mis en place le système de traduction (comme ngx-translate)

Sinon:

- J'ai commit le .env (mais bien entendu faut pas faire ça !).
- Pas mis de rate limite sur l'api (attention au brut force du mdp).
- Je n'ai pas mis en place le temps réel (si un autre utilisateur créé un article, un commentaire ou un emodification...), il faut recharger la page pour s'en rendre compte.
- Ne gère pas le multi tab (par exemple, si un utilisateur ouvre plusieurs pages et se déconnecte cela ne se répercute pas).
- J'ai stoqué le JWT dans le localstorage. Ce n'est pas le plus sécurisé, il vaut mieux préférer les cookies.

- Sur le token JWT, je n'ai pas mis de date d'expiration

- Je n'ai pas mis de guard sur Angular pour accéder à l'édition d'une ressource seulement si on a le droit, toutefois, le serveur renvoie un code d'erreur si on n'est pas autorisé à les modifier.

- J'ai fait un article simple titre et contenue, mais bien entendue c'est pour le test, il vaut mieux implémenter un éditeur de texte pour rédiger des articles, et gérer les images.

- Je n'ai pas mis en place le SSR, bien que c'est utile si on veut référencer les articles.

- Je me suis amusé à essayer quelques outils Ngrx/component & TanStackQuery pour ma culture Angular.

- J'ai pris du temps pour améliorer le système d'autorisation par role (RBAC), pour qu'il soit mieux typé et que je puisse l'utiliser sur mon projet perso.

# Temps passé

~12h30
