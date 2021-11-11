# heroku-BE

Primeiro projeto Growdev no Heroku -- Módulo III

# Rotas:

//********************\*\********************* DELETE
//=======APAGA UMA TRANSAÇÃO
delete('/user/:userid/transaction/:trasid)

//=======APAGA UM USUARIO
delete('/user/:id')

//********************\*\*\********************* PUT
//========EDITA UMA TRANSAÇÃO
put('/user/:userid/transaction/:trasid')

//========EDITA UM USUARIO
put('/user/:id')

//********************\*\*\********************* GET
//========CALCULA O SALDO DO USUARIO
get('/user/:id')

//========MOSTRA TODOS OS USUARIOS SEM AS TRANSAÇÕES
get('/users')

//=======MOSTRA UM USUARIO SEM AS TRANSAÇÕES
get('/users/:id')

//=======MOSTRA UMA TRANSAÇÃO DE UM USUÁRIO
get('/user/:userid/transaction/:transid')

//********************\*\********************* POST
//======ADICONA TRANSAÇÕES
post('/user/:userid/transactions')

//======ADICIONA USUARIO
post('/users')

//=====================================================
// INFORMAÇÕES INICIAIS AO RODAR O PROGRAMA

let AllUsers:User[] = [
{
"id": 0,
"name": "Marcio",
"cpf": "9211573.741-30",
"email": "aqui@mesmo.org",
"age": 22,
"transaction": [
{
"id": 0,
"title": "T1 Marcio",
"value": 100,
"type": "income"
},
{
"id": 1,
"title": "T2 Marcio",
"value": 50,
"type": "outcome"
}
]
},
{
"id": 1,
"name": "Paulo",
"cpf": "9214573.741-30",
"email": "aqui@mesmo.org",
"age": 33,
"transaction": [
{
"id": 2,
"title": "T1 Paulo",
"value": 222,
"type": "income"
}
]
},
{
"id": 2,
"name": "Fernando",
"cpf": "9214573.741-10",
"email": "aqui@mesmo.org",
"age": 22,
"transaction": []
},
{
"id": 3,
"name": "Marcelo",
"cpf": "9214573.331-10",
"email": "aqui@mesmo.org",
"age": 55,
"transaction": [
{
"id": 3,
"title": "T1 Marcelo",
"value": 222,
"type": "outcome"
}
]
}
]
