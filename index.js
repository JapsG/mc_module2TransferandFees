const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

/*
const newPair = Keypair.generate();
console.log(newPair);
*/

const DEMO_FROM_SECRET_KEY = new Uint8Array(
      [
          146, 234, 160, 213, 103, 238, 16, 86, 103, 63, 101,
           27, 32, 136, 55, 75, 218, 221, 71, 170, 78, 121,
          193, 112, 203, 125, 39, 121, 159, 105, 159, 2, 219,
           186, 122, 9, 147, 27, 203, 206, 92, 211, 227, 235,
          54, 143, 133, 23, 142, 0, 222, 29, 239, 93, 243,
          104, 250, 229, 49, 232, 26, 22, 237, 71
        ]            
  );


const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    const to = Keypair.generate();
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    var fromWalletBalance = await connection.getBalance(
        new PublicKey(from._keypair.publicKey)
    );
    console.log(`Senders (from) Wallet Balance: ${parseInt(fromWalletBalance) / LAMPORTS_PER_SOL} SOL`);

    var halfBalance = fromWalletBalance / 2;

    var toWalletBalance = await connection.getBalance(
        new PublicKey(to._keypair.publicKey)
    );
    console.log(`Receivers (to) Wallet balance: ${parseInt(toWalletBalance) / LAMPORTS_PER_SOL} SOL`);

    if(fromWalletBalance <= 0) {
        console.log("Airdopping some SOL to Sender wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(from.publicKey),
            2 * LAMPORTS_PER_SOL
        );


        let latestBlockHash = await connection.getLatestBlockhash();


        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAirDropSignature
        });

        console.log("Airdrop completed for the Sender account");
        var fromWalletBalance2 = await connection.getBalance(
            new PublicKey(from._keypair.publicKey)
        );
        console.log(`Senders (from) Wallet Balance after Airdrop: ${parseInt(fromWalletBalance2) / LAMPORTS_PER_SOL} SOL`);
    } else {
        console.log("There is no need for an airdrop, Senders (from) wallet have enough balance.");
    }

    console.log(`50% of Senders (from) Balance is: ${(halfBalance / LAMPORTS_PER_SOL)} SOL`);


        console.log("halfbalance:", halfBalance);
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: parseInt(halfBalance)
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);

    var fromWalletBalance3 = await connection.getBalance(
        new PublicKey(from._keypair.publicKey)
    );
    console.log(`Senders (from) Wallet balance: ${parseInt(fromWalletBalance3) / LAMPORTS_PER_SOL} SOL`);

    var toWalletBalance3 = await connection.getBalance(
        new PublicKey(to._keypair.publicKey)
    );
    console.log(`Receivers (to) Wallet balance: ${parseInt(toWalletBalance3) / LAMPORTS_PER_SOL} SOL`);
}

transferSol();