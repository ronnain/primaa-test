J'ai commit le .env (mais bien entendu faut pas faire ça !)
Pas mis de rate limite sur l'api (attention au brut force du mdp)
Ne gère pas le multi tab (si un utilisateur ouvre plusieurs pages et se déconnecte d'une)
J'ai stoqué le JWT dans le localstorage/avantage inconvénient // cookies (pas fou niveau sécurité)
Lors de la création d'un article, je récupère l'autheur de l'article depuis le body de la requête, il vaut mieux le récupérer depuis les infos de l'émetteur dans le token

todo make a postman collection
pas mis en place le système de traduction (ngx-translate)

// identifiant de test romain@test.fr romaintest

// todo voir pour le conflit de dépendence

JWT pas mis de date d'expiration/pas géré

page articles: géré un délais minimum de chargement pour éviter le blink
Page edition d'article: mettre un guard
Page article details: pagination comments
