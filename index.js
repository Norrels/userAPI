const fastify = require("fastify")({ logger: true });
const { v4: uuidv4 } = require("uuid");

fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});

let users = [];

fastify.get("/users", async () => {
  return users;
});

fastify.get("/users/:id", async (request, reply) => {
  const { id } = request.params;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return reply.code(404).send({ error: "Usuário não encontrado" });
  }

  return user;
});

fastify.post("/users", async (request, reply) => {
  const { name, email } = request.body;

  if (!name || !email) {
    return reply.code(400).send({ error: "Nome e e-mail são obrigatórios" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
  };

  users.push(newUser);
  reply.code(201).send(newUser);
});

fastify.put("/users/:id", async (request, reply) => {
  const { id } = request.params;
  const { name, email } = request.body;

  const user = users.find((u) => u.id === id);
  if (!user) {
    return reply.code(404).send({ error: "Usuário não encontrado" });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  return user;
});

fastify.delete("/users/:id", async (request, reply) => {
  const { id } = request.params;
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return reply.code(404).send({ error: "Usuário não encontrado" });
  }

  users.splice(index, 1);
  reply.code(204).send();
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("🚀 Servidor rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
