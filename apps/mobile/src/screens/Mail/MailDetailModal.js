// src/screens/Mail/MailDetailModal.js

import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

/**
 * MailDetailModal 컴포넌트
 */
export default function MailDetailModal({ visible, mail, onClose, onMarkAsRead }) {
    
    // 모달이 열릴 때 읽음 처리 로직 실행
    useEffect(() => {
        if (visible && mail && !mail.read) {
            // 메일 ID를 사용하여 읽음 처리 요청
            onMarkAsRead(mail.id);
        }
    }, [visible, mail, onMarkAsRead]);


    if (!mail) return null; 

    return (
        <Modal
            animationType="slide" 
            transparent={true}
            visible={visible}
            onRequestClose={onClose} 
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    
                    {/* 닫기 버튼 */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>닫기</Text> 
                    </TouchableOpacity>

                    {/* 메일 제목 */}
                    <Text style={styles.mailTitle}>{mail.title}</Text>
                    <Text style={styles.mailDate}>도착일: {mail.date}</Text>
                    
                    {/* 내용 스크롤 영역 */}
                    <ScrollView style={styles.contentScroll}>
                        <Text style={styles.mailContent}>{mail.content}</Text>
                    </ScrollView>
                    
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end", 
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    },
    modalView: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        alignItems: "stretch",
        height: '80%', 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 5,
        marginBottom: 10,
    },
    closeButtonText: {
        color: '#1E3A8A',
        fontWeight: 'bold',
    },
    mailTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 5,
        color: '#111827',
    },
    mailDate: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    contentScroll: {
        flex: 1,
    },
    mailContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
    },
});