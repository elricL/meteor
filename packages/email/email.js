Email = {};

(function () {

  var MailComposer = __meteor_bootstrap__.require('mailcomposer').MailComposer;

  if (process.env.MAIL_URL)
    throw new Error("SMTP not yet implemented");

  var next_devmode_mail_id = 0;

  /**
   * Send an email.
   *
   * Connects to the mail server configured via the MAIL_URL environment
   * variable. If unset, prints formatted message to stdout. May yield.
   *
   * @param options
   * @param options.from {String} RFC5322 "From:" address
   * @param options.to {String|String[]} RFC5322 "To:" address[es]
   * @param options.cc {String|String[]} RFC5322 "Cc:" address[es]
   * @param options.bcc {String|String[]} RFC5322 "Bcc:" address[es]
   * @param options.replyTo {String|String[]} RFC5322 "Reply-To:" address[es]
   * @param options.subject {String} RFC5322 "Subject:" line
   * @param options.text {String} RFC5322 mail body (plain text)
   */
  Email.send = function (options) {
    var mc = new MailComposer();

    // setup message data
    // XXX support HTML body
    // XXX support attachments
    // XXX support arbitrary headers
    mc.setMessageOption({
      from: options.from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text
    });

    var devmode_mail_id = next_devmode_mail_id++;

    // XXX are we guaranteed that this happens before the message?
    process.stdout.write("====== BEGIN MAIL #" + devmode_mail_id +
                         " ======\n");
    mc.streamMessage();
    // XXX support SMTP
    mc.pipe(process.stdout, {end: false});
    mc.on('end', function () {
      process.stdout.write("====== END MAIL #" + devmode_mail_id +
                           " ======\n");
    });
  };

})();
