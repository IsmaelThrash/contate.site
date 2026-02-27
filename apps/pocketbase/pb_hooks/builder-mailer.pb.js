
/// <reference path="../pb_data/types.d.ts" />
onMailerSend((e) => {
    if (e.app.settings().smtp.enabled) {
        return e.next()
    }

    const senderAddress = $os.getenv("BUILDER_MAILER_SENDER_ADDRESS");

    const payload = {
        "subject": e.message.subject,
        "content": {
            ...(e.message.html ? {
                "html": e.message.html,
            } : {
                "text": e.message.text,
            }),
            "type": "plain",
        },
        "from": senderAddress,
        "replyTo": senderAddress,
        "to": e.message.to[0].address,
    }

    const response = $http.send({
        url: `${$os.getenv("BUILDER_MAILER_API_URL")}/api/v2/email`,
        method: "POST",
        headers: {
            "Authorization": `Bearer ${$os.getenv("BUILDER_MAILER_API_KEY")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    
    if (response.statusCode !== 200) {
        $app.logger().error("Failed to send email", "error", response.json);

        throw new ApiError(500, response.json?.message || 'Failed to send email');
    }
})
