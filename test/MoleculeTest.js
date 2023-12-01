const Molecule = artifacts.require("Molecule");

contract("Molecule Test", ([account]) => {
  it("test molecule parse table offset", async () => {
    const molecule = await Molecule.new();
    console.log("Molecule deployed on ", molecule.address);
    const r1 = await molecule.tableOffset("0x2b000000180000001c000000", 0, 0);
    assert.equal(r1, 0x18);
    const r2 = await molecule.tableOffset("0x2b000000180000001c000000", 0, 1);
    assert.equal(r2, 0x1c);
  });

  it("test molecule parse transaction", async () => {
    // https://explorer.nervos.org/transaction/0xc892f1d3ddce6f70a35c939b899959795c8041c6aae399bcd836a318751663b9
    const txBytes = "0xef0500000c000000e1030000d50300001c00000020000000dd000000e100000069010000a1030000000000000500000071a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c0100000001c7813f6a415144643970c2e88e0bb6ca6a8edc5dd7c1022746f628284a9936d500000000003f9fd8ba3b47bd2617171d18d02c23c6f9a9e6178ebb5e1d73e99201322d04410000000000ce082bf5d63ec854e20795871bca43bc526bb805e9dfc58303738c4cd302f3b1000000000071a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c0000000001000000000300000000000000000000001b236b8405316cd57e49833d0f98b49c10f19db9702e986dd9133dce057995900000000000000000000000000934fa0ad51e9be71c07592b5eb6ab68269cff6981e783f8920255ce08f086050100000000000000000000001b236b8405316cd57e49833d0f98b49c10f19db9702e986dd9133dce05799590030000003802000014000000750000002b010000d701000061000000100000001800000061000000009d966b01000000490000001000000030000000310000005c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a801140000009a38a68bcffdaa0a4d2ed72999d68053a1c07b7cb600000010000000180000006100000000902f500900000049000000100000003000000031000000bf43c3602455798c1a61a596e0d95278864c552fafe231c063b3fabf97a8febc0114000000b6b88ce730a8fecd3ab5731b6e3858cea70d4499550000001000000030000000310000005e7a36a77e68eecc013dfa2fe6a23f3b6c344b04005808694ae6dd45eea4cfd501200000009ea7beb4a36469e00bb30dbac75e93672441b483d519556ba9d1424b9294eae5ac0000001000000018000000ac00000000889f2a030000009400000010000000300000003100000093bc7a915d3d8f8b9678bc6c7a1751738c99ce6e66bba4dfab56672f6d691789015f0000005f0000001000000030000000310000005a78d27a6d4489bb79ea7ce5af02f2e2c50a2d4f967b686a1be58a596c701d77012a000000307837313330643241313242394243624641653466323633346438363441314565314365334561643963610000001000000018000000610000004cccc14563360000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce801140000004eb12e1bed91afad5aacc92d7930bd18d2f6f4e13400000014000000180000002c0000003000000000000000100000000050226958700100000000000000000000000000000000000e02000010000000b1010000b50100009d0100009d010000100000003f0100009d0100002b01000000000305e51a129cb9a74b4bd33297ce6106143444c04620abbf7302026821b3373a919b9ff0edd9df4840998cce589fc1776be0a2bda587eda1789fe9c0a78ac93777a8f275fb6990dec7895efb9d207227ab2f7a9efa73c62a06d41e5ea97f219d1cff3148a117d9894c5e10bd3047dae215df13247ff8053bde1914dfd0b8e89f272bc3fc91845118f711f95a73cbc54970a12612ebb3289daab8a7c7461836c42fa5d03f16aa013d7f885d1fc5327d9d68563c67a98451b361810025cee140349bde5f7f687f8c34d5231a6db43bb90a0791249aa6f8607cca45b0922d3c37e0ef2c0799ec4595017a5491360e9ca4bf0a36f699ae6869c9d1d0c681dfeb62ddf05e7ea221fa51c81d7e6e3f34ce9a35ddd9a0d9947e048f32470ad5c2f535728d0ca6767cbe2d29015a0000005a000000080000005200000008000000460000003078376265613864373465663936653539333137343366643739653163663036366435316234326533643062626635353236393234316261313032633530393031322d31353600000000550000005500000010000000550000005500000041000000cf648c8b9e36366eabad0a534063614880022f3c9e879e293353cdefca4fb4e11e8ead86ad3285088a2bec75ac6d1b618cd6eca38d155ed407dddd01fa6c9a1d00";
    const molecule = await Molecule.new();
    console.log("Molecule deployed on ", molecule.address);

    // parse fields count
    const txFields = await molecule.tableFieldsCount(txBytes, 0);
    assert.equal(txFields, 2);

    // parse raw transaction
    const {0: rawTxOffset, 1: size} = await molecule.readCKBTxRaw(txBytes);
    console.log("raw tx", rawTxOffset.toString(), size.toString());

    // check raw transaction fields
    const rawTxFields = await molecule.tableFieldsCount(txBytes, rawTxOffset);
    assert.equal(rawTxFields, 6);

    // parse transaction witness output type field
    const witnessCount = await molecule.readCKBTxWitnessCount(txBytes);
    console.log("witness count", witnessCount.toString());
    assert.equal(witnessCount, 3);

    // parse transaction witness lock field
    const {0: lockOffset, 1: lockSize} = await molecule.readCKBTxWitness(txBytes, 0, 0);
    console.log("witness lock offset", lockOffset.toString(), "size", lockSize.toString());
    assert.equal(lockSize, 299);

    // parse transaction witness input type field
    const {0: iTypeOffset, 1: iTypeSize} = await molecule.readCKBTxWitness(txBytes, 0, 1);
    console.log("witness input type offset", iTypeOffset.toString(), "size", iTypeSize.toString());
    assert.equal(iTypeSize, 90);

    // parse transaction witness output type field
    const {0: oTypeOffset, 1: oTypeSize} = await molecule.readCKBTxWitness(txBytes, 0, 2);
    console.log("witness output type offset", oTypeOffset.toString(), "size", oTypeSize.toString());
    assert.equal(oTypeSize, 0);
  });
});

