<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $type;
    public $code;

    /**
     * Create a new message instance.
     */
    public function __construct($type, $code)
    {
        $this->type = $type;
        $this->code = $code;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject($this->type === 'verification' ? 'Verifikasi Email Anda' : 'Reset Password Anda')
                    ->view('emails.otp');
    }
}
