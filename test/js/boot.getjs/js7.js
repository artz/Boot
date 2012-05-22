/* JS #7 */
if (!this.BOOTGETJSTEST) {
    this.BOOTGETJSTEST = { scriptCounter: 0 };
}
this.BOOTGETJSTEST.js7 = true;
this.BOOTGETJSTEST.currentScript = 7;
this.BOOTGETJSTEST.scriptCounter += 1;
if (this.console) {
    this.console.log("Executed js7.js.");
}
