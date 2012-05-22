/* JS #5 */
if (!this.BOOTGETJSTEST) {
    this.BOOTGETJSTEST = { scriptCounter: 0 };
}
this.BOOTGETJSTEST.js5 = true;
this.BOOTGETJSTEST.currentScript = 5;
this.BOOTGETJSTEST.scriptCounter += 1;
if (this.console) {
    this.console.log("Executed js5.js.");
}
