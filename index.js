/* eslint no-console: 0 */
import poppinsMemoryReporter from "./src";

poppinsMemoryReporter().then(report => console.log(report));
