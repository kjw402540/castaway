// src/screens/Mail/MailPage.js

import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useMail } from "./hooks/useMail"; 
import MailDetailModal from "./MailDetailModal"; 
import { useBackExit } from "../../hooks/useBackExit"; 


// 임시 아이콘 
const CheckIcon = ({ isSelected }) => (
    <View style={[styles.checkIcon, isSelected ? styles.checkSelected : styles.checkUnselected]}>
        {isSelected && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
    </View>
);

// ------------------------------------------------
export default function MailPage() {
    const { 
        mails, 
        selectedMailIds, 
        isEditMode, 
        isLoading,
        detailMail,
        setDetailMail,
        toggleSelect,
        setIsEditMode,
        handleDeleteSelected,
        handleMarkAsRead, 
        toggleSelectAll,
        handleSelectAllDelete, // 이 함수가 useMail에서 제공되어야 합니다
    } = useMail();

    // 앱 종료 훅 적용
    useBackExit(); 

    const isAllSelected = selectedMailIds.length === mails.length && mails.length > 0;
    const isAnySelected = selectedMailIds.length > 0;

    const renderMail = ({ item }) => {
        const isSelected = selectedMailIds.includes(item.id);
        
        return (
            <TouchableOpacity 
                style={[styles.mailCard, isEditMode && styles.mailCardEdit]}
                onPress={() => isEditMode ? toggleSelect(item.id) : setDetailMail(item)} 
                onLongPress={() => setIsEditMode(true)} 
            >
                {isEditMode && <CheckIcon isSelected={isSelected} />} 

                <View style={styles.mailContent}>
                    <Text style={[styles.title, item.read && styles.titleRead]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Mail</Text>
                
                {/* 우측 상단 버튼 */}
                <View style={styles.actionButtons}>
                    {/* 편집 모드 진입/나가기 버튼 */}
                    <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
                        <Text style={styles.actionText}>{isEditMode ? '나가기' : '편집'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 본문 (Empty View 또는 FlatList) */}
            {mails.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>아직 도착한 편지가 없어요.</Text>
                </View>
            ) : (
                <FlatList
                    data={mails}
                    renderItem={renderMail}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* 하단 삭제 액션바 (편집 모드일 때만) */}
            {isEditMode && (
                <View style={styles.deleteActionBar}>
                    <TouchableOpacity 
                        onPress={toggleSelectAll} 
                        style={styles.deleteBtn}
                    >
                        <Text style={styles.deleteText}>
                            {isAllSelected ? '전체 해제' : '전체 선택'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={handleDeleteSelected} 
                        style={[styles.deleteBtn, !isAnySelected && styles.deleteBtnDisabled]}
                        disabled={!isAnySelected}
                    >
                        <Text style={styles.deleteText}>
                            선택 삭제 ({selectedMailIds.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={handleSelectAllDelete} 
                        style={styles.deleteBtn}
                    >
                        <Text style={styles.deleteText}>모두 삭제</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 메일 상세 모달 연결 */}
            <MailDetailModal
                visible={!!detailMail} 
                mail={detailMail}
                onClose={() => setDetailMail(null)} 
                onMarkAsRead={handleMarkAsRead} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#A7D8FF", 
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1E3A8A",
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionText: {
        fontSize: 16,
        color: "#1E3A8A",
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 20,
    },
    mailCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mailCardEdit: {
        paddingLeft: 10, 
    },
    mailContent: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    titleRead: {
        color: "#6B7280", 
        fontWeight: '400',
    },
    date: {
        marginTop: 6,
        fontSize: 13,
        color: "#6B7280",
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#1E3A8A",
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkSelected: {
        backgroundColor: "#1E3A8A",
        borderColor: "#1E3A8A",
    },
    checkUnselected: {
        backgroundColor: 'white',
    },
    emptyBox: {
        marginTop: 60,
        backgroundColor: "rgba(255, 255, 255, 0.5)", 
        paddingVertical: 80,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: "#4B5563",
        fontWeight: '500',
    },
    deleteActionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E3A8A', 
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    deleteBtn: {
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    deleteBtnDisabled: {
        opacity: 0.5,
    },
    deleteText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },
});