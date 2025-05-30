document.addEventListener("DOMContentLoaded", function() {
            const chatbotButton = document.getElementById("chatbot-button");
            const chatbotPopup = document.getElementById("chatbot-popup");
            const closeChatbot = document.getElementById("close-chatbot");
            const chatInput = document.getElementById("chat-input");
            const sendMessage = document.getElementById("send-message");
            const chatArea = document.getElementById("chat-area");
            const quickActions = document.querySelectorAll(".quick-action");
            const typingIndicator = document.getElementById("typing-indicator");

            let isOpen = false;
            let messageCount = 0;

            // Enhanced responses with more detailed information
            const responses = {
                // Greetings
                "hello": "Hello! 👋 Welcome to my portfolio showcase. I'm here to help you navigate through my projects, games, blog posts, and more. What would you like to explore first?",
                "hi": "Hi there! 🌟 Thanks for visiting my portfolio. I can show you around my projects, games, or blog posts. What catches your interest?",
                "hey": "Hey! 🚀 Ready to explore some cool projects? I can guide you through my web development work, games, or technical blog posts.",
                "good morning": "Good morning! ☀️ Hope you're having a great day. Let me help you discover my latest projects and creations.",
                "good afternoon": "Good afternoon! 🌅 Perfect time to explore some interactive projects. What would you like to see?",
                "good evening": "Good evening! 🌙 Great time to dive into some coding projects or play a quick game. What interests you?",

                // Projects
                "show projects": "🎯 Here are my featured projects:<br><br>• <strong>Password Security Suite</strong> - Advanced password strength analyzer with hashing<br>• <strong>AES-256 Encryption Tool</strong> - Secure data encryption/decryption<br>• <strong>Interactive Games</strong> - Browser-based entertainment<br>• <strong>Portfolio Website</strong> - This very site you're on!<br><br>Visit my <a href='projects.html' class='text-primary-600 hover:underline font-semibold'>Projects Page</a> to see them all in action! 🚀",
                "projects": "My project portfolio includes web applications, security tools, and interactive experiences. Each project showcases different technical skills from frontend development to cybersecurity. Would you like to know more about any specific type?",
                "web development": "💻 My web development projects focus on:<br>• Modern JavaScript frameworks<br>• Responsive design with CSS/Tailwind<br>• Interactive user experiences<br>• Performance optimization<br><br>Check out the live demos on my projects page!",
                "cybersecurity": "🔐 My cybersecurity projects include:<br>• Password strength analysis tools<br>• AES encryption implementations<br>• Security best practices demos<br>• Vulnerability assessment tools<br><br>All built with security-first principles in mind!",

                // Games
                "games": "🎮 I've created some fun browser games:<br><br>• <strong>Tic Tac Toe</strong> - Classic strategy game with AI<br>• <strong>The Cube</strong> - 3D puzzle challenge<br>• <strong>More coming soon!</strong><br><br>Try them out on my <a href='games.html' class='text-green-600 hover:underline font-semibold'>Games Page</a>! 🕹️",
                "play games": "Ready for some fun? 🎲 You can play:<br>• <a href='games/tic-tac-toe.html' class='text-green-600 hover:underline'>Tic Tac Toe</a> - Test your strategy skills<br>• <a href='games/the-cube.html' class='text-green-600 hover:underline'>The Cube</a> - 3D puzzle solving<br><br>Which one sounds more interesting to you?",
                "tic tac toe": "⭕ Tic Tac Toe is a classic! My version features:<br>• Smart AI opponent<br>• Clean, modern interface<br>• Score tracking<br>• Responsive design<br><br><a href='games/tic-tac-toe.html' class='text-green-600 hover:underline font-semibold'>Play now!</a>",
                "the cube": "🧩 The Cube is a challenging 3D puzzle game:<br>• Interactive 3D graphics<br>• Multiple difficulty levels<br>• Intuitive controls<br>• Achievement system<br><br><a href='games/the-cube.html' class='text-purple-600 hover:underline font-semibold'>Try the challenge!</a>",

                // Blog
                "blog": "📝 My blog covers:<br>• Technical tutorials<br>• Project development stories<br>• Cybersecurity insights<br>• Coding best practices<br><br>Visit my <a href='blog.html' class='text-purple-600 hover:underline font-semibold'>Blog Page</a> to read the latest posts!",
                "read blog": "📚 Some popular blog posts include:<br>• 'Building Secure Password Systems'<br>• 'Modern Web Development Practices'<br>• 'Game Development with JavaScript'<br>• 'Cybersecurity for Developers'<br><br>Which topic interests you most?",
                "tutorials": "🎓 I write tutorials on:<br>• Web development fundamentals<br>• JavaScript advanced concepts<br>• Security implementation<br>• UI/UX best practices<br><br>Perfect for developers at any level!",

                // Simulations
                "simulations": "🔬 My interactive simulations include:<br>• Password strength analyzer<br>• AES encryption demo<br>• Hash function comparisons<br>• Security vulnerability demos<br><br>Visit <a href='simulations.html' class='text-blue-600 hover:underline font-semibold'>Simulations</a> to try them out!",
                "encryption": "🔐 The AES-256 encryption tool demonstrates:<br>• Real-time encryption/decryption<br>• Secure key generation<br>• Multiple cipher modes<br>• Educational explanations<br><br><a href='simulations/aes-encryption.html' class='text-blue-600 hover:underline font-semibold'>Try it here!</a>",
                "password": "🔑 The password tool analyzes:<br>• Strength scoring<br>• Entropy calculation<br>• Hash generation (bcrypt, SHA)<br>• Security recommendations<br><br><a href='simulations/password-strength.html' class='text-orange-600 hover:underline font-semibold'>Test your passwords!</a>",

                // About & Contact
                "about": "👨‍💻 I'm a passionate developer focused on:<br>• Web application development<br>• Cybersecurity research<br>• Interactive game design<br>• Educational content creation<br><br>Learn more on my <a href='about.html' class='text-indigo-600 hover:underline font-semibold'>About Page</a>!",
                "contact": "📧 Let's connect! You can reach me through:<br>• Email form on my website<br>• Professional networking platforms<br>• Project collaboration inquiries<br><br>Visit my <a href='contact.html' class='text-red-600 hover:underline font-semibold'>Contact Page</a> to get in touch!",
                "contact info": "📱 I'd love to hear from you! Use my <a href='contact.html' class='text-red-600 hover:underline font-semibold'>Contact Form</a> for:<br>• Project collaboration<br>• Technical questions<br>• Feedback and suggestions<br>• Job opportunities<br><br>I typically respond within 24 hours! 🚀",

                // Skills & Technologies
                "skills": "🛠️ My technical skills include:<br>• <strong>Frontend:</strong> HTML, CSS, JavaScript, React<br>• <strong>Backend:</strong> Node.js, Python, PHP<br>• <strong>Security:</strong> Cryptography, Penetration Testing<br>• <strong>Tools:</strong> Git, Docker, VS Code<br><br>Always learning new technologies!",
                "technologies": "💻 I work with modern technologies:<br>• JavaScript ES6+, TypeScript<br>• CSS3, Sass, Tailwind CSS<br>• React, Vue.js frameworks<br>• Security libraries and tools<br>• Database systems<br><br>Technology stack varies by project needs!",

                // Help & Features
                "help": "🤝 I can help you with:<br>• 🎯 Exploring my projects and demos<br>• 🎮 Finding games to play<br>• 📚 Discovering blog content<br>• 🔧 Learning about my tech stack<br>• 📧 Getting contact information<br>• 🎨 Understanding my design process<br><br>Just ask me anything!",
                "what can you do": "🤖 As your portfolio assistant, I can:<br>• Guide you through all my projects<br>• Recommend games based on your interests<br>• Suggest relevant blog posts<br>• Explain technical concepts<br>• Provide contact information<br>• Share development insights<br><br>Think of me as your personal tour guide! 🎯",

                // Fun responses
                "thanks": "You're very welcome! 😊 I'm glad I could help. Feel free to explore more of my work or ask me anything else!",
                "thank you": "My pleasure! 🌟 It's great to see your interest in my projects. Is there anything specific you'd like to dive deeper into?",
                "awesome": "Thanks! 🚀 I put a lot of effort into making each project both functional and engaging. What would you like to explore next?",
                "cool": "Glad you think so! 😎 There's plenty more to discover. Want to try out a game or check out some code?",
                "amazing": "Thank you so much! ✨ That really motivates me to keep creating. What other projects catch your eye?",

                // Default fallback
                "default": "🤔 That's an interesting question! While I might not have a specific answer for that, I can definitely help you explore my projects, games, blog posts, or get in touch with me. What would you like to discover? 🚀"
            };

            function getBotReply(message) {
                const key = message.toLowerCase().trim();
                
                // Direct match
                if (responses[key]) {
                    return responses[key];
                }
                
                // Partial matching for more natural conversations
                for (const [keyword, response] of Object.entries(responses)) {
                    if (key.includes(keyword) || keyword.includes(key)) {
                        return response;
                    }
                }
                
                return responses["default"];
            }

            function addMessage(message, isUser, delay = 0) {
                setTimeout(() => {
                    const messageDiv = document.createElement("div");
                    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'} mb-4 animate-slide-up`;
                    
                    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    
                    if (isUser) {
                        messageDiv.innerHTML = `
                            <div class="flex items-start space-x-3 justify-end">
                                <div class="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm max-w-xs">
                                    <p class="text-sm leading-relaxed">${message}</p>
                                    <div class="text-xs opacity-75 mt-2">${timestamp}</div>
                                </div>
                                <div class="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-user text-white text-sm"></i>
                                </div>
                            </div>
                        `;
                    } else {
                        messageDiv.innerHTML = `
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-robot text-white text-sm"></i>
                                </div>
                                <div class="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100 max-w-xs">
                                    <p class="text-gray-800 text-sm leading-relaxed">${message}</p>
                                    <div class="text-xs text-gray-500 mt-2">${timestamp}</div>
                                </div>
                            </div>
                        `;
                    }
                    
                    // Remove quick actions when user sends first message
                    if (isUser && messageCount === 0) {
                        const quickActionsDiv = document.getElementById("quick-actions");
                        if (quickActionsDiv) {
                            quickActionsDiv.style.display = "none";
                        }
                    }
                    
                    chatArea.appendChild(messageDiv);
                    chatArea.scrollTop = chatArea.scrollHeight;
                    messageCount++;
                }, delay);
            }

            function showTypingIndicator() {
                typingIndicator.classList.remove("hidden");
            }

            function hideTypingIndicator() {
                typingIndicator.classList.add("hidden");
            }

            function sendChatMessage() {
                const message = chatInput.value.trim();
                if (message) {
                    addMessage(message, true);
                    chatInput.value = "";
                    sendMessage.disabled = true;
                    
                    // Show typing indicator
                    showTypingIndicator();
                    
                    // Simulate typing delay and send bot response
                    setTimeout(() => {
                        hideTypingIndicator();
                        const botReply = getBotReply(message);
                        addMessage(botReply, false);
                        sendMessage.disabled = false;
                        chatInput.focus();
                    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
                }
            }

            // Event Listeners
            chatbotButton.addEventListener("click", () => {
                if (isOpen) {
                    chatbotPopup.style.transform = "scale(0)";
                    chatbotPopup.style.opacity = "0";
                    isOpen = false;
                } else {
                    chatbotPopup.style.transform = "scale(1)";
                    chatbotPopup.style.opacity = "1";
                    isOpen = true;
                    setTimeout(() => chatInput.focus(), 300);
                }
            });

            closeChatbot.addEventListener("click", () => {
                chatbotPopup.style.transform = "scale(0)";
                chatbotPopup.style.opacity = "0";
                isOpen = false;
            });

            sendMessage.addEventListener("click", sendChatMessage);

            chatInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                }
            });

            // Auto-resize input
            chatInput.addEventListener("input", function() {
                sendMessage.disabled = this.value.trim() === "";
            });

            // Quick action buttons
            quickActions.forEach(button => {
                button.addEventListener("click", function() {
                    const action = this.textContent.trim();
                    addMessage(action, true);
                    
                    setTimeout(() => {
                        showTypingIndicator();
                        setTimeout(() => {
                            hideTypingIndicator();
                            const botReply = getBotReply(action.toLowerCase());
                            addMessage(botReply, false);
                        }, 800);
                    }, 200);
                });
            });

            // Close on outside click
            document.addEventListener("click", (e) => {
                if (isOpen && !chatbotPopup.contains(e.target) && !chatbotButton.contains(e.target)) {
                    chatbotPopup.style.transform = "scale(0)";
                    chatbotPopup.style.opacity = "0";
                    isOpen = false;
                }
            });

            // Initialize
            sendMessage.disabled = true;
        });