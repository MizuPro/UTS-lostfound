// assets/js/chat.js
document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('krlChatWidget');
    const toggleBtn = document.getElementById('chatToggleBtn');
    const minimizeBtn = document.getElementById('chatMinimizeBtn');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatWidget && toggleBtn && minimizeBtn) {
        // Open Chat
        toggleBtn.addEventListener('click', () => {
            chatWidget.classList.remove('minimized');
            chatWidget.classList.add('maximized');
            chatInput.focus();
        });

        // Close Chat
        minimizeBtn.addEventListener('click', () => {
            chatWidget.classList.remove('maximized');
            chatWidget.classList.add('minimized');
        });

        // Send Message
        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (text !== '') {
                // Determine current time
                const now = new Date();
                let hours = now.getHours();
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; 
                const timeStr = hours.toString().padStart(2, '0') + ':' + minutes + ' ' + ampm;

                // Create template HTML safely 
                const msgDiv = document.createElement('div');
                msgDiv.className = 'message msg-sent';
                
                const bubble = document.createElement('div');
                bubble.className = 'msg-bubble';
                bubble.textContent = text;
                
                const timeDiv = document.createElement('div');
                timeDiv.className = 'msg-time';
                timeDiv.textContent = timeStr;
                
                msgDiv.appendChild(bubble);
                msgDiv.appendChild(timeDiv);
                
                chatMessages.appendChild(msgDiv);
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                const isOfficer = chatWidget.getAttribute('data-officer') === 'true';

                // Simulate reply after 1.5 seconds
                setTimeout(() => {
                    const replyText = isOfficer 
                        ? "Baik min, terima kasih banyak ya. Saya akan lapor lewat web sekarang juga." 
                        : "Terima kasih atas pesan Anda. Silakan isi laporan kehilangan di form agar bisa kami lacak.";
                    
                    const replyDiv = document.createElement('div');
                    replyDiv.className = 'message msg-received';
                    replyDiv.innerHTML = `<div class="msg-bubble">${replyText}</div><div class="msg-time">${timeStr}</div>`;
                    chatMessages.appendChild(replyDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            }
        };

        chatSendBtn.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});
