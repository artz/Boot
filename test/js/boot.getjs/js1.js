/* JS #1 */
if (!this.BOOTGETJSTEST) {
    this.BOOTGETJSTEST = { scriptCounter: 0 };
}
this.BOOTGETJSTEST.js1 = true;
this.BOOTGETJSTEST.currentScript = 1;
this.BOOTGETJSTEST.scriptCounter += 1;
if (this.console) {
    this.console.log("Executed js1.js.");
}
