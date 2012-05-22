/* JS #3 */
if (!this.BOOTGETJSTEST) {
    this.BOOTGETJSTEST = { scriptCounter: 0 };
}
this.BOOTGETJSTEST.js3 = true;
this.BOOTGETJSTEST.currentScript = 3;
this.BOOTGETJSTEST.scriptCounter += 1;
if (this.console) {
    this.console.log("Executed js3.js.");
}
