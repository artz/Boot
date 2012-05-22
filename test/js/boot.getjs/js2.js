/* JS #2 */
if (!this.BOOTGETJSTEST) {
    this.BOOTGETJSTEST = { scriptCounter: 0 };
}
this.BOOTGETJSTEST.js2 = true;
this.BOOTGETJSTEST.currentScript = 2;
this.BOOTGETJSTEST.scriptCounter += 1;
if (this.console) {
    this.console.log("Executed js2.js.");
}
