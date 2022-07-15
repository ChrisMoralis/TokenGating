const Moralis = require("moralis/node");

/**
 * @description
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 */
const secret = async (req, res) => {
  try {
    // Initialize Moralis
    await Moralis.start({
      appId: process.env.MORALIS_APP_ID,
      serverUrl: process.env.MORALIS_SERVER_URL,
      masterKey: process.env.MORALIS_MASTER_KEY,
    });

    // Query Session From DB
    const query = new Moralis.Query("_Session");
    const { sessionToken } = req.body;
    const { ethAddress } = req.body;

    console.log(`New request from user: ${ethAddress}`);
    console.log(`Checking the database for session token: ${sessionToken}`);
    query.include("user");
    query.equalTo("sessionToken", sessionToken);
    query.limit(1);
    const result = await query.find({ useMasterKey: true });
    // Check whether user own certain NFT on MATIC
    if (result.length > 0) {
      console.log(`This user has a valid session token`);
      // Run a Web3API call
      const _address = result[0].get("user").get("accounts")[0];
      const CONTRACT_ADDRESS = "0x6638cb79f6c1c70b09e8b6efebca3233d3240c74";
      const NFTs = await Moralis.Web3API.account.getNFTsForContract({
        address: _address,
        token_address: CONTRACT_ADDRESS,
        chain: "matic",
      });
      //console.log(`Number of qualifying NFTs: ${NFTs.total}`);

      // If no NFT found, then return empty array for `NFTdata`
      res.send({
        NFTdata: NFTs || [],
        user: _address,
      });
    } else {
      res.send({});
    }
  } catch (error) {
    res.error({ error });
  }
};

module.exports = secret;
