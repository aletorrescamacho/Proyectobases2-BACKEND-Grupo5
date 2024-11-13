export default () => ({
    neo4j: {
      uri: process.env.NEO4J_URI || 'neo4j+s://a4ac6e62.databases.neo4j.io:7687',
      username: process.env.NEO4J_USERNAME || 'neo4j',
      password: process.env.NEO4J_PASSWORD || 'oRAQxIQNJchAA5zmamQHs-r1ji6y4_BB0Xv3AgT8QTw',
    },
    port: parseInt(process.env.PORT, 10) || 3001,
  });
  