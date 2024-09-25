const { generateKeyPair, exportJWK } = require("jose");

const createKeyPair = async () => {
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  console.log(
    "Public Key ##########################################################################",
  );
  console.log(JSON.stringify(await exportJWK(publicKey)));
  console.log(
    "Private Key ##########################################################################",
  );
  console.log(JSON.stringify(await exportJWK(privateKey)));
};

createKeyPair();
