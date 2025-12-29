import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, IconButton } from '../components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComplaintsStackParamList } from '../navigation/AuthenticatedTabs';
import { colors } from '../constants/colors';
import { useComplaintDb } from '../contexts/ComplaintDbContext';
import { Comment } from '../types/shared';
import { getMapPreview, fetchAddress } from '../utils/mapUtils';

type Props = NativeStackScreenProps<ComplaintsStackParamList, 'ComplaintDetail'>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted':
      return colors.gray500;
    case 'under_review':
      return colors.info;
    case 'scheduled':
      return colors.warning;
    case 'in_progress':
      return colors.primary;
    case 'resolved':
      return colors.success;
    case 'dismissed':
      return colors.error;
    default:
      return colors.gray500;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'scheduled':
      return 'Scheduled';
    case 'in_progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'dismissed':
      return 'Dismissed';
    default:
      return status;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'noise':
      return 'Noise';
    case 'sanitation':
      return 'Sanitation';
    case 'public_safety':
      return 'Public Safety';
    case 'traffic':
      return 'Traffic';
    case 'infrastructure':
      return 'Infrastructure';
    case 'water_electricity':
      return 'Water & Electricity';
    case 'domestic':
      return 'Domestic';
    case 'environment':
      return 'Environment';
    case 'others':
      return 'Others';
    default:
      return category;
  }
};

export default function ComplaintDetailScreen({ route, navigation }: Props) {
  const { complaintId } = route.params;
  const { getComplaint } = useComplaintDb();
  const complaint = getComplaint(complaintId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    async function loadAddress() {
      if (complaint && complaint.location) {
        const fetchedAddress = await fetchAddress(complaint.location.latitude, complaint.location.longitude);
        setAddress(fetchedAddress);
      }
    }
    loadAddress();
  }, [complaint]);
  
  if (!complaint) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-base" style={{ color: colors.gray500 }}>
          Complaint not found
        </Text>
      </View>
    );
  }
  
  const statusColor = getStatusColor(complaint.status);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      // TODO: Implement comment submission
      console.log('Submitting comment:', commentText);
      setCommentText('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyText.trim()) {
      // TODO: Implement reply submission
      console.log('Submitting reply to comment:', commentId, replyText);
      setReplyText('');
      setReplyingToCommentId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.info;
      case 'low':
        return colors.gray500;
      default:
        return colors.gray500;
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header with Back Button */}
      <View 
        className="px-4 py-4 flex-row items-center border-b"
        style={{ borderBottomColor: colors.gray200 }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          className="mr-3 active:opacity-70"
        >
          <Ionicons name="arrow-back" size={24} color={colors.gray700} />
        </Pressable>
        <Text className="text-xl font-semibold flex-1" style={{ color: colors.gray900 }}>
          Complaint Details
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Title and Status */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold mb-3" style={{ color: colors.gray900 }}>
            {complaint.title}
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: `${statusColor}15` }}
            >
              <Text className="text-sm font-semibold" style={{ color: statusColor }}>
                {getStatusLabel(complaint.status)}
              </Text>
            </View>
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: `${getPriorityColor(complaint.priority)}15` }}
            >
              <Text className="text-sm font-semibold" style={{ color: getPriorityColor(complaint.priority) }}>
                {getPriorityLabel(complaint.priority)} Priority
              </Text>
            </View>
          </View>
        </View>

        {/* Image Carousel */}
        {complaint.images && complaint.images.length > 0 && (
          <View className="mb-4">
            <FlatList
              data={complaint.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setCurrentImageIndex(index);
              }}
              renderItem={({ item }) => (
                <View style={{ width: screenWidth, height: screenWidth * 0.75 }}>
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
              )}
              keyExtractor={(_item, index) => index.toString()}
            />
            {complaint.images.length > 1 && (
              <View className="absolute bottom-4 self-center flex-row gap-2">
                {complaint.images.map((_item, index) => (
                  <View
                    key={index}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: index === currentImageIndex ? colors.white : 'rgba(255,255,255,0.5)',
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Description */}
        <View className="px-4 pb-4">
          <Text className="text-base font-semibold mb-2" style={{ color: colors.gray900 }}>
            Description
          </Text>
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <Text className="text-base leading-6" style={{ color: colors.gray700 }}>
              {complaint.description}
            </Text>
          </View>
        </View>

        {/* Voting Section */}
        <View className="px-4 pb-4">
          <View
            className="flex-row items-center justify-around py-3 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <Pressable className="flex-row items-center px-4 py-2 active:opacity-70">
              <Ionicons name="thumbs-up-outline" size={24} color={colors.success} />
              <Text className="text-base font-semibold ml-2" style={{ color: colors.gray900 }}>
                {complaint.likes?.length || 0}
              </Text>
            </Pressable>
            <View style={{ width: 1, height: 30, backgroundColor: colors.gray300 }} />
            <Pressable className="flex-row items-center px-4 py-2 active:opacity-70">
              <Ionicons name="thumbs-down-outline" size={24} color={colors.error} />
              <Text className="text-base font-semibold ml-2" style={{ color: colors.gray900 }}>
                {complaint.dislikes?.length || 0}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Info Cards */}
        <View className="px-4 pb-4 gap-3">
          {/* Category */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="pricetag" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Category
              </Text>
            </View>
            <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
              {getCategoryLabel(complaint.category)}
            </Text>
          </View>

          {/* Complainant */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="person" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Reported by
              </Text>
            </View>
            <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
              {complaint.complainantName}
            </Text>
          </View>

          {/* Date */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Date Submitted
              </Text>
            </View>
            <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
              {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Scheduled Date */}
          {complaint.scheduledAt && (
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color={colors.warning} />
                <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                  Scheduled Date
                </Text>
              </View>
              <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
                {new Date(complaint.scheduledAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}

          {/* Resolved Date */}
          {complaint.resolvedAt && (
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                  Resolved Date
                </Text>
              </View>
              <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
                {new Date(complaint.resolvedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}

          {/* Location */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Location
              </Text>
            </View>
            <View>
              {address && (
                <Text className="text-base mb-3" style={{ color: colors.gray900 }}>
                  {address}
                </Text>
              )}
              {complaint.location && (
                <Image
                  source={{ uri: getMapPreview(complaint.location.latitude, complaint.location.longitude) }}
                  style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 12 }}
                  resizeMode="cover"
                />
              )}
              {complaint.location && (
                <IconButton
                  onPress={() => {
                    navigation.navigate('MapView', {
                      latitude: complaint.location!.latitude,
                      longitude: complaint.location!.longitude,
                      title: complaint.title,
                      address: address,
                    });
                  }}
                  icon="map"
                  title="View on Map"
                  variant="primary"
                />
              )}
            </View>
          </View>
        </View>

        {/* Resolution Details */}
        {complaint.resolutionDetails && (
          <View className="px-4 mt-6">
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.success + '10', borderWidth: 1, borderColor: colors.success }}
            >
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                <Text className="ml-2 text-lg font-semibold" style={{ color: colors.success }}>
                  Resolution Details
                </Text>
              </View>
              <Text className="text-base mb-3" style={{ color: colors.gray700 }}>
                {complaint.resolutionDetails.description}
              </Text>
              {complaint.resolutionDetails.budget && (
                <View className="flex-row items-center">
                  <Ionicons name="cash-outline" size={18} color={colors.gray600} />
                  <Text className="ml-2 text-sm" style={{ color: colors.gray600 }}>
                    Budget: ₱{complaint.resolutionDetails.budget.toLocaleString()}
                  </Text>
                </View>
              )}
              {complaint.resolutionDetails.images && complaint.resolutionDetails.images.length > 0 && (
                <View className="mt-3">
                  <Text className="text-sm font-medium mb-2" style={{ color: colors.gray700 }}>
                    Resolution Images:
                  </Text>
                  <View className="gap-2">
                    {complaint.resolutionDetails.images.map((img, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: img.uri }}
                        style={{ width: '100%', height: 200, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Comment Input */}
        <View className="px-4 mt-6">
          <Text className="text-base font-semibold mb-2" style={{ color: colors.gray900 }}>
            Add a Comment
          </Text>
          <View
            className="p-3 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <TextInput
              placeholder="Write your comment here..."
              placeholderTextColor={colors.gray400}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="text-base mb-3"
              style={{ color: colors.gray900, minHeight: 80 }}
            />
            <Button
              onPress={handleSubmitComment}
              title="Post Comment"
              variant="primary"
            />
          </View>
        </View>
        {/* Comments Section */}
        {complaint.comments && complaint.comments.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.gray900 }}>
              Comments ({complaint.comments.length})
            </Text>
            <View className="gap-3">
              {complaint.comments.map((comment: Comment) => (
                <View
                  key={comment.id}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
                >
                  {/* Comment Header */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Text className="text-sm font-semibold" style={{ color: colors.white }}>
                          {comment.userName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View className="ml-2 flex-1">
                        <Text className="text-sm font-semibold" style={{ color: colors.gray900 }}>
                          {comment.userName}
                        </Text>
                        <Text className="text-xs" style={{ color: colors.gray400 }}>
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Comment Content */}
                  <Text className="text-base mb-3" style={{ color: colors.gray700 }}>
                    {comment.content}
                  </Text>

                  {/* Comment Voting and Reply */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                      <Pressable className="flex-row items-center active:opacity-70">
                        <Ionicons name="thumbs-up-outline" size={18} color={colors.success} />
                        <Text className="text-sm ml-1" style={{ color: colors.gray600 }}>
                          {comment.likes?.length || 0}
                        </Text>
                      </Pressable>
                      <Pressable className="flex-row items-center active:opacity-70">
                        <Ionicons name="thumbs-down-outline" size={18} color={colors.error} />
                        <Text className="text-sm ml-1" style={{ color: colors.gray600 }}>
                          {comment.dislikes?.length || 0}
                        </Text>
                      </Pressable>
                    </View>
                    <Pressable
                      className="flex-row items-center active:opacity-70"
                      onPress={() => setReplyingToCommentId(comment.id)}
                    >
                      <Ionicons name="return-down-forward" size={18} color={colors.primary} />
                      <Text className="text-sm ml-1 font-medium" style={{ color: colors.primary }}>
                        Reply
                      </Text>
                    </Pressable>
                  </View>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <View className="mt-3 ml-4 pl-3 border-l-2" style={{ borderLeftColor: colors.gray300 }}>
                      {comment.replies.map((reply) => (
                        <View key={reply.id} className="mb-3">
                          <View className="flex-row items-center mb-1">
                            <View
                              className="w-6 h-6 rounded-full items-center justify-center"
                              style={{ backgroundColor: reply.isAdmin ? colors.primary : colors.gray400 }}
                            >
                              <Text className="text-xs font-semibold" style={{ color: colors.white }}>
                                {reply.userName.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                            <Text className="text-sm font-semibold ml-2" style={{ color: colors.gray900 }}>
                              {reply.userName}
                              {reply.isAdmin && (
                                <Text className="text-xs font-normal" style={{ color: colors.primary }}>
                                  {' '}(Admin)
                                </Text>
                              )}
                            </Text>
                          </View>
                          <Text className="text-sm ml-8 mb-2" style={{ color: colors.gray700 }}>
                            {reply.content}
                          </Text>
                          <View className="flex-row items-center ml-8 gap-4">
                            <Text className="text-xs" style={{ color: colors.gray400 }}>
                              {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Text>
                            <View className="flex-row items-center gap-3">
                              <View className="flex-row items-center">
                                <Ionicons name="thumbs-up-outline" size={14} color={colors.success} />
                                <Text className="text-xs ml-1" style={{ color: colors.gray500 }}>
                                  {reply.likes?.length || 0}
                                </Text>
                              </View>
                              <View className="flex-row items-center">
                                <Ionicons name="thumbs-down-outline" size={14} color={colors.error} />
                                <Text className="text-xs ml-1" style={{ color: colors.gray500 }}>
                                  {reply.dislikes?.length || 0}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Reply Input */}
                  {replyingToCommentId === comment.id && (
                    <View
                      className="mt-3 p-3 rounded-lg"
                      style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray300 }}
                    >
                      <TextInput
                        placeholder="Write your reply..."
                        placeholderTextColor={colors.gray400}
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        className="text-sm mb-2"
                        style={{ color: colors.gray900, minHeight: 60 }}
                      />
                      <View className="flex-row gap-2">
                        <Pressable
                          className="flex-1 py-2 rounded-lg items-center active:opacity-70"
                          style={{ backgroundColor: colors.primary }}
                          onPress={() => handleSubmitReply(comment.id)}
                        >
                          <Text className="text-sm font-semibold" style={{ color: colors.white }}>
                            Submit Reply
                          </Text>
                        </Pressable>
                        <Pressable
                          className="flex-1 py-2 rounded-lg items-center active:opacity-70"
                          style={{ backgroundColor: colors.gray200 }}
                          onPress={() => {
                            setReplyingToCommentId(null);
                            setReplyText('');
                          }}
                        >
                          <Text className="text-sm font-semibold" style={{ color: colors.gray700 }}>
                            Cancel
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
