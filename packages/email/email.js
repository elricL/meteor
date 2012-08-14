Email = {};

(function () {
  var Future = __meteor_bootstrap__.require('fibers/future');
  // js2-mode AST blows up when parsing 'future.return()', so alias.
  Future.prototype.ret = Future.prototype.return;

  var MailComposer = __meteor_bootstrap__.require('mailcomposer').MailComposer;

  if (process.env.MAIL_URL)
    throw new Error("SMTP not yet implemented");

  Email._next_devmode_mail_id = 0;

  // Overridden by tests.
  Email._output_stream = process.stdout;

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

    var devmode_mail_id = Email._next_devmode_mail_id++;

    // This approach does not prevent other writers to stdout from interleaving.
    Email._output_stream.write("====== BEGIN MAIL #" + devmode_mail_id +
                               " ======\n");
    mc.streamMessage();
    // XXX support SMTP
    mc.pipe(Email._output_stream, {end: false});
    var future = new Future;
    mc.on('end', function () {
      Email._output_stream.write("====== END MAIL #" + devmode_mail_id +
                                 " ======\n");
      future.ret();
    });
    future.wait();
  };

})();
