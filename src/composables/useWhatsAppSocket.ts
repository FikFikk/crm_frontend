// // composables/useWhatsAppSocket.ts
// import { ref, onMounted, onUnmounted } from 'vue'
// import { io, type Socket } from 'socket.io-client'

// export interface WhatsAppMessage {
//   success: boolean;
//   chat: {
//     id: number;
//     messageId: string;
//     body: string;
//     direction: 'in' | 'out';
//     companyId: string;
//     created: string;
//     type?: string;
//     imageURL?: string;
//     videoURL?: string;
//     audioURL?: string;
//     documentURL?: string;
//     locationLat?: string;
//     locationLong?: string;
//   };
//   customer: {
//     name: string;
//     phone: string;
//   };
//   company: {
//     id: string;
//   };
// }

// export interface ConnectionStatus {
//   company_id: string;
//   status: 'connected' | 'connecting' | 'disconnected';
//   connected: boolean;
//   phone_number?: string;
// }

// export interface QRCodeData {
//   company_id: string;
//   qr_code: string;
//   status: string;
// }

// export function useWhatsAppSocket(companyId: string) {
//   // Reactive state
//   const socket = ref<Socket | null>(null)
//   const connectionStatus = ref<string>('disconnected')
//   const isConnected = ref(false)
//   const phoneNumber = ref<string | null>(null)
//   const lastError = ref<string | null>(null)

//   // Event callbacks
//   const messageReceivedCallbacks = ref<Array<(message: WhatsAppMessage) => void>>([])
//   const messageSentCallbacks = ref<Array<(message: WhatsAppMessage) => void>>([])
//   const connectionStatusCallbacks = ref<Array<(status: ConnectionStatus) => void>>([])
//   const qrCodeCallbacks = ref<Array<(qr: QRCodeData) => void>>([])
//   const errorCallbacks = ref<Array<(error: string) => void>>([])

//   // Socket.IO configuration
//   const SOCKET_URL = 'http://localhost:3001'
//   const SOCKET_OPTIONS = {
//     transports: ['websocket', 'polling'],
//     timeout: 20000,
//     forceNew: true,
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000
//   }

//   // Connect to Socket.IO server
//   function connect() {
//     if (socket.value?.connected) {
//       console.log('Socket already connected')
//       return
//     }

//     console.log(`🔌 Connecting to WhatsApp Socket.IO server for company ${companyId}...`)
    
//     socket.value = io(SOCKET_URL, SOCKET_OPTIONS)

//     // Connection events
//     socket.value.on('connect', () => {
//       console.log('✅ Connected to Socket.IO server:', socket.value?.id)
//       isConnected.value = true
//       lastError.value = null
      
//       // Join company room
//       socket.value?.emit('join_company', companyId)
//       console.log(`📢 Joined company room: ${companyId}`)
//     })

//     socket.value.on('disconnect', (reason) => {
//       console.log('❌ Disconnected from Socket.IO server:', reason)
//       isConnected.value = false
//       connectionStatus.value = 'disconnected'
//     })

//     socket.value.on('connect_error', (error) => {
//       console.error('❌ Socket.IO connection error:', error)
//       lastError.value = error.message
//       triggerErrorCallbacks(error.message)
//     })

//     socket.value.on('reconnect', (attemptNumber) => {
//       console.log('🔄 Socket.IO reconnected after', attemptNumber, 'attempts')
//       isConnected.value = true
//       lastError.value = null
//     })

//     socket.value.on('reconnect_error', (error) => {
//       console.error('❌ Socket.IO reconnection error:', error)
//       lastError.value = error.message
//     })

//     // WhatsApp specific events
//     socket.value.on('connection_status', (data: ConnectionStatus) => {
//       console.log('📱 WhatsApp connection status:', data)
//       connectionStatus.value = data.status
//       phoneNumber.value = data.phone_number || null
//       triggerConnectionStatusCallbacks(data)
//     })

//     socket.value.on('qr_code_generated', (data: QRCodeData) => {
//       console.log('🔳 QR Code generated:', data)
//       triggerQRCodeCallbacks(data)
//     })

//     socket.value.on('message_received', (message: WhatsAppMessage) => {
//       console.log('📨 Real-time message received:', message)
//       triggerMessageReceivedCallbacks(message)
//     })

//     socket.value.on('message_sent', (message: WhatsAppMessage) => {
//       console.log('📤 Message sent confirmation:', message)
//       triggerMessageSentCallbacks(message)
//     })

//     socket.value.on('connection_error', (data: { company_id: string; error: string }) => {
//       console.error('⚠️ WhatsApp connection error:', data)
//       connectionStatus.value = 'disconnected'
//       triggerErrorCallbacks(data.error)
//     })
//   }

//   // Disconnect from Socket.IO server
//   function disconnect() {
//     if (socket.value) {
//       console.log('🔌 Disconnecting from Socket.IO server...')
//       socket.value.disconnect()
//       socket.value = null
//       isConnected.value = false
//       connectionStatus.value = 'disconnected'
//     }
//   }

//   // Trigger callback functions
//   function triggerMessageReceivedCallbacks(message: WhatsAppMessage) {
//     messageReceivedCallbacks.value.forEach(callback => {
//       try {
//         callback(message)
//       } catch (error) {
//         console.error('Error in message received callback:', error)
//       }
//     })
//   }

//   function triggerMessageSentCallbacks(message: WhatsAppMessage) {
//     messageSentCallbacks.value.forEach(callback => {
//       try {
//         callback(message)
//       } catch (error) {
//         console.error('Error in message sent callback:', error)
//       }
//     })
//   }

//   function triggerConnectionStatusCallbacks(status: ConnectionStatus) {
//     connectionStatusCallbacks.value.forEach(callback => {
//       try {
//         callback(status)
//       } catch (error) {
//         console.error('Error in connection status callback:', error)
//       }
//     })
//   }

//   function triggerQRCodeCallbacks(qr: QRCodeData) {
//     qrCodeCallbacks.value.forEach(callback => {
//       try {
//         callback(qr)
//       } catch (error) {
//         console.error('Error in QR code callback:', error)
//       }
//     })
//   }

//   function triggerErrorCallbacks(error: string) {
//     errorCallbacks.value.forEach(callback => {
//       try {
//         callback(error)
//       } catch (error) {
//         console.error('Error in error callback:', error)
//       }
//     })
//   }

//   // Event listener management
//   function onMessageReceived(callback: (message: WhatsAppMessage) => void) {
//     messageReceivedCallbacks.value.push(callback)
//     return () => {
//       const index = messageReceivedCallbacks.value.indexOf(callback)
//       if (index > -1) {
//         messageReceivedCallbacks.value.splice(index, 1)
//       }
//     }
//   }

//   function onMessageSent(callback: (message: WhatsAppMessage) => void) {
//     messageSentCallbacks.value.push(callback)
//     return () => {
//       const index = messageSentCallbacks.value.indexOf(callback)
//       if (index > -1) {
//         messageSentCallbacks.value.splice(index, 1)
//       }
//     }
//   }

//   function onConnectionStatus(callback: (status: ConnectionStatus) => void) {
//     connectionStatusCallbacks.value.push(callback)
//     return () => {
//       const index = connectionStatusCallbacks.value.indexOf(callback)
//       if (index > -1) {
//         connectionStatusCallbacks.value.splice(index, 1)
//       }
//     }
//   }

//   function onQRCodeGenerated(callback: (qr: QRCodeData) => void) {
//     qrCodeCallbacks.value.push(callback)
//     return () => {
//       const index = qrCodeCallbacks.value.indexOf(callback)
//       if (index > -1) {
//         qrCodeCallbacks.value.splice(index, 1)
//       }
//     }
//   }

//   function onError(callback: (error: string) => void) {
//     errorCallbacks.value.push(callback)
//     return () => {
//       const index = errorCallbacks.value.indexOf(callback)
//       if (index > -1) {
//         errorCallbacks.value.splice(index, 1)
//       }
//     }
//   }

//   // Utility functions
//   async function checkConnectionStatus() {
//     try {
//       const response = await fetch(`http://localhost:3001/status/${companyId}`)
//       const data = await response.json()
      
//       if (data.success) {
//         connectionStatus.value = data.status
//         phoneNumber.value = data.phone_number
//         console.log('📱 Initial WhatsApp status:', data)
//       }
//     } catch (error) {
//       console.error('❌ Error checking WhatsApp status:', error)
//     }
//   }

//   async function generateQRCode() {
//     try {
//       const response = await fetch(`http://localhost:3001/qr-code?id=${companyId}`)
//       const data = await response.json()
      
//       console.log('🔳 QR Code generation result:', data)
//       return data
//     } catch (error) {
//       console.error('❌ Error generating QR code:', error)
//       throw error
//     }
//   }

//   async function disconnectWhatsApp() {
//     try {
//       const response = await fetch(`http://localhost:3001/disconnect/${companyId}`, {
//         method: 'POST'
//       })
//       const data = await response.json()
      
//       console.log('🔌 WhatsApp disconnect result:', data)
//       return data
//     } catch (error) {
//       console.error('❌ Error disconnecting WhatsApp:', error)
//       throw error
//     }
//   }

//   // Auto connect on mount
//   onMounted(() => {
//     connect()
//     checkConnectionStatus()
//   })

//   // Auto disconnect on unmount
//   onUnmounted(() => {
//     disconnect()
//   })

//   return {
//     // State
//     socket,
//     connectionStatus,
//     isConnected,
//     phoneNumber,
//     lastError,
    
//     // Methods
//     connect,
//     disconnect,
//     checkConnectionStatus,
//     generateQRCode,
//     disconnectWhatsApp,
    
//     // Event listeners
//     onMessageReceived,
//     onMessageSent,
//     onConnectionStatus,
//     onQRCodeGenerated,
//     onError
//   }
// }