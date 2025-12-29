import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, IconButton } from '../components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransparencyStackParamList } from '../navigation/AuthenticatedTabs';
import { colors } from '../constants/colors';
import { useProjectDb } from '../contexts/ProjectDbContext';
import { Comment } from '../types/shared';
import { getMapPreview, fetchAddress } from '../utils/mapUtils';

type Props = NativeStackScreenProps<TransparencyStackParamList, 'ProjectDetail'>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned':
      return colors.gray500;
    case 'approved':
      return colors.info;
    case 'ongoing':
      return colors.primary;
    case 'on_hold':
      return colors.warning;
    case 'completed':
      return colors.success;
    case 'cancelled':
      return colors.error;
    default:
      return colors.gray500;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'planned':
      return 'Planned';
    case 'approved':
      return 'Approved';
    case 'ongoing':
      return 'Ongoing';
    case 'on_hold':
      return 'On Hold';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'infrastructure':
      return 'Infrastructure';
    case 'health':
      return 'Health';
    case 'education':
      return 'Education';
    case 'environment':
      return 'Environment';
    case 'livelihood':
      return 'Livelihood';
    case 'disaster_preparedness':
      return 'Disaster Preparedness';
    case 'social_services':
      return 'Social Services';
    case 'sports_culture':
      return 'Sports & Culture';
    case 'others':
      return 'Others';
    default:
      return category;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function ProjectDetailScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { projects } = useProjectDb();
  const project = projects.find(p => p.id === projectId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    async function loadAddress() {
      if (project?.location) {
        const fetchedAddress = await fetchAddress(project.location.latitude, project.location.longitude);
        setAddress(fetchedAddress);
      }
    }
    loadAddress();
  }, [project]);
  
  if (!project) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-base" style={{ color: colors.gray500 }}>
          Project not found
        </Text>
      </View>
    );
  }
  
  const statusColor = getStatusColor(project.status);

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
          Project Details
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Title and Status */}
        <View className="px-4 pt-4 pb-4">
          <View className="flex-row items-start justify-between">
            <Text className="text-2xl font-bold flex-1 mr-3" style={{ color: colors.gray900 }}>
              {project.title}
            </Text>
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: `${statusColor}15` }}
            >
              <Text className="text-sm font-semibold" style={{ color: statusColor }}>
                {getStatusLabel(project.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Image Carousel */}
        {project.images && project.images.length > 0 && (
          <View className="mb-4">
            <FlatList
              data={project.images}
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
              keyExtractor={(item, index) => index.toString()}
            />
            {project.images.length > 1 && (
              <View className="absolute bottom-4 self-center flex-row gap-2">
                {project.images.map((_, index) => (
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
          <Text className="text-lg font-semibold mb-2" style={{ color: colors.gray900 }}>
            Description
          </Text>
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <Text className="text-base leading-6" style={{ color: colors.gray700 }}>
              {project.description}
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
                {project.likes?.length || 0}
              </Text>
            </Pressable>
            <View style={{ width: 1, height: 30, backgroundColor: colors.gray300 }} />
            <Pressable className="flex-row items-center px-4 py-2 active:opacity-70">
              <Ionicons name="thumbs-down-outline" size={24} color={colors.error} />
              <Text className="text-base font-semibold ml-2" style={{ color: colors.gray900 }}>
                {project.dislikes?.length || 0}
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
              {getCategoryLabel(project.category)}
            </Text>
          </View>

          {/* Budget */}
          {project.budget && (
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="cash" size={20} color={colors.primary} />
                <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                  Budget
                </Text>
              </View>
              <Text className="text-base mt-1 ml-7 font-semibold" style={{ color: colors.primary }}>
                {formatCurrency(project.budget)}
              </Text>
            </View>
          )}

          {/* Contractor */}
          {project.contractor && (
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="briefcase" size={20} color={colors.primary} />
                <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                  Contractor
                </Text>
              </View>
              <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
                {project.contractor}
              </Text>
            </View>
          )}

          {/* Source of Funds */}
          {project.sourceOfFunds && (
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="wallet" size={20} color={colors.primary} />
                <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                  Source of Funds
                </Text>
              </View>
              <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
                {project.sourceOfFunds}
              </Text>
            </View>
          )}

          {/* Timeline */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Timeline
              </Text>
            </View>
            <View className="ml-7">
              <View className="flex-row items-center mb-2">
                <Text className="text-sm font-medium mr-2" style={{ color: colors.gray600 }}>
                  Start Date:
                </Text>
                <Text className="text-base" style={{ color: colors.gray900 }}>
                  {formatDate(project.startDate)}
                </Text>
              </View>
              {project.expectedCompletionDate && (
                <View className="flex-row items-center mb-2">
                  <Text className="text-sm font-medium mr-2" style={{ color: colors.gray600 }}>
                    Expected Completion:
                  </Text>
                  <Text className="text-base" style={{ color: colors.gray900 }}>
                    {formatDate(project.expectedCompletionDate)}
                  </Text>
                </View>
              )}
              {project.actualCompletionDate && (
                <View className="flex-row items-center">
                  <Text className="text-sm font-medium mr-2" style={{ color: colors.gray600 }}>
                    Actual Completion:
                  </Text>
                  <Text className="text-base" style={{ color: colors.success }}>
                    {formatDate(project.actualCompletionDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Progress Percentage */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons name="stats-chart" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Progress
              </Text>
            </View>
            <View className="ml-7">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {project.progressPercentage}%
                </Text>
                <Text className="text-sm" style={{ color: colors.gray600 }}>
                  {project.progressPercentage === 100 ? 'Completed' : 'In Progress'}
                </Text>
              </View>
              <View className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: colors.gray200 }}>
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: project.progressPercentage === 100 ? colors.success : colors.primary,
                    width: `${project.progressPercentage}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Location */}
          {project.location && (
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
                <Image
                  source={{ uri: getMapPreview(project.location!.latitude, project.location!.longitude) }}
                  style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 12 }}
                  resizeMode="cover"
                />
                <IconButton
                  onPress={() => {
                    navigation.navigate('MapView', {
                      latitude: project.location!.latitude,
                      longitude: project.location!.longitude,
                      title: project.title,
                      address: address,
                    });
                  }}
                  icon="map"
                  title="View on Map"
                  variant="primary"
                />
              </View>
            </View>
          )}
        </View>

        {/* Progress Updates */}
        {project.progressUpdates && project.progressUpdates.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.gray900 }}>
              Progress Updates ({project.progressUpdates.length})
            </Text>
            <View className="gap-3">
              {project.progressUpdates.map((update, index) => (
                <View
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
                >
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="information-circle" size={20} color={colors.info} />
                    <Text className="ml-2 text-xs" style={{ color: colors.gray500 }}>
                      {new Date(update.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text className="text-base mb-3" style={{ color: colors.gray700 }}>
                    {update.description}
                  </Text>
                  {update.image && (
                    <Image
                      source={{ uri: update.image.uri }}
                      style={{ width: '100%', height: 200, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}
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
        {project.comments && project.comments.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.gray900 }}>
              Comments ({project.comments.length})
            </Text>
            <View className="gap-3">
              {project.comments.map((comment: Comment) => (
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
