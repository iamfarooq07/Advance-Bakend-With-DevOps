export const sendEmail = async () => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    });

    console.log("Email Send");
};