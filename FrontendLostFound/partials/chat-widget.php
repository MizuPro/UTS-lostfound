<!-- partials/chat-widget.php -->
<?php $isOfficer = isset($isOfficerPage) && $isOfficerPage; ?>
<div id="krlChatWidget" class="chat-widget minimized" data-officer="<?= $isOfficer ? 'true' : 'false' ?>">
    <!-- Minimized State (Button) -->
    <button id="chatToggleBtn" class="chat-toggle-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        <span class="chat-badge"><?= $isOfficer ? '2' : '1' ?></span>
    </button>

    <!-- Maximized State (Window) -->
    <div class="chat-window">
        <!-- Header -->
        <div class="chat-header">
            <div class="chat-header-info">
                <?php if ($isOfficer): ?>
                    <strong>Pelaporan Publik</strong>
                    <span>Live Chat KAI (Kotak Masuk)</span>
                <?php else: ?>
                    <strong>Pesan Anonim (Live Chat)</strong>
                    <span>Customer Service KAI</span>
                <?php endif; ?>
            </div>
            <button id="chatMinimizeBtn" class="chat-minimize-btn">&minus;</button>
        </div>
        
        <!-- Messages Area -->
        <div class="chat-messages">
            <?php if ($isOfficer): ?>
                <div class="message msg-received">
                    <div class="msg-bubble">Permisi min, saya sepertinya kehilangan dompet hitam di Stasiun Manggarai pagi ini.</div>
                    <div class="msg-time">08:05 AM</div>
                </div>
                <div class="message msg-received">
                    <div class="msg-bubble">Kira-kira prosedur lapornya bagaimana ya kalau saya sudah terlanjur pulang?</div>
                    <div class="msg-time">08:06 AM</div>
                </div>
            <?php else: ?>
                <div class="message msg-received">
                    <div class="msg-bubble">Halo! Ada yang bisa kami bantu terkait layanan Lost and Found KRL?</div>
                    <div class="msg-time">08:00 AM</div>
                </div>
                <div class="message msg-sent">
                    <div class="msg-bubble">Iya min, saya sepertinya kehilangan dompet di Stasiun Manggarai pagi ini.</div>
                    <div class="msg-time">08:05 AM</div>
                </div>
                <div class="message msg-received">
                    <div class="msg-bubble">Baik kak, silakan menuju halaman <b>Lapor Kehilangan</b> ya untuk mengisi data barang secara lengkap agar segera kami telusuri.</div>
                    <div class="msg-time">08:06 AM</div>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Input Area -->
        <div class="chat-input-area">
            <input type="text" id="chatInput" placeholder="Ketik pesan..." class="chat-input">
            <button id="chatSendBtn" class="chat-send-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
        </div>
    </div>
</div>

<style>
/* Chat Widget Styles */
.chat-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    font-family: inherit;
}

/* Toggle Button */
.chat-toggle-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #c51d1d; /* KRL Red */
    color: #ffffff;
    border: none;
    box-shadow: var(--shadow, 0 10px 24px rgba(0,0,0,0.15));
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s;
}
.chat-toggle-btn:hover {
    transform: scale(1.05);
}
.chat-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #ffc107;
    color: #111;
    font-size: 12px;
    font-weight: 800;
    border-radius: 50%;
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
}

/* Chat Window */
.chat-window {
    width: 350px;
    height: 450px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: var(--shadow, 0 18px 40px rgba(0,0,0,0.15));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    transform-origin: bottom right;
    border: 1px solid rgba(19, 19, 22, 0.08);
}

/* State Classes */
.chat-widget.minimized .chat-window {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
}
.chat-widget.maximized .chat-toggle-btn {
    display: none;
}
.chat-widget.maximized .chat-window {
    transform: scale(1);
    opacity: 1;
    pointer-events: auto;
}

/* Chat Header */
.chat-header {
    background: #c51d1d; /* KRL Red */
    color: #fff;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.chat-header-info strong {
    display: block;
    font-size: 15px;
}
.chat-header-info span {
    display: block;
    font-size: 12px;
    opacity: 0.8;
}
.chat-minimize-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}
.chat-minimize-btn:hover {
    background: rgba(0,0,0,0.1);
}

/* Chat Messages */
.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.message {
    display: flex;
    flex-direction: column;
    max-width: 85%;
}
.msg-received {
    align-self: flex-start;
}
.msg-sent {
    align-self: flex-end;
}
.msg-bubble {
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.5;
}
.msg-received .msg-bubble {
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.05);
    border-bottom-left-radius: 4px;
}
.msg-sent .msg-bubble {
    background: #dcf8c6;
    border-bottom-right-radius: 4px;
}
.msg-time {
    font-size: 11px;
    color: var(--text-soft, #66646d);
    margin-top: 4px;
    padding: 0 4px;
}
.msg-sent .msg-time {
    text-align: right;
}

/* Input Area */
.chat-input-area {
    padding: 14px 20px;
    background: #fff;
    border-top: 1px solid rgba(0,0,0,0.05);
    display: flex;
    gap: 12px;
    align-items: center;
}
.chat-input {
    flex: 1;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px;
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
    background: #f8f9fa;
}
.chat-send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #c51d1d;
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5; /* disabled state */
}

/* Mobile Responsiveness */
@media (max-width: 500px) {
    .chat-window {
        width: 100vw;
        height: 100vh;
        height: -webkit-fill-available;
        bottom: -24px;
        right: -24px;
        border-radius: 0;
    }
}
</style>
