User
-id (chave primária)
-name

Session
-id (chave primária)
-user_id (chave estrangeira)
-created_at

Meal
-id (chave primária)
-name
-description
-created_at
-is_on_diet
-session_id (chave estrangeira)

• Se o usuário não estiver registrado:

- Pedir para o usuário se registrar na rota "/register", com nome e email

• Após registrar:

- Gerar um session_id automaticamente, associando esse id a um usuário

• Se o usuário estiver registrado, mas não enviar o session_id pelos cookies:

- Pedir para fazer o login na rota "/login", informando apenas o email. Com isso, retornará um session_id para o usuário na forma de cookies

• Se o usuário tiver o session_id, as rotas funcionarão de maneira correta, como listagem de refeições, criação, remoção, busca, etc
