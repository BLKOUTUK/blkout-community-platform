// BLKOUT Liberation Platform - Virtual Scrolling List Component
// Optimized for large datasets with accessibility and trauma-informed design

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { cn } from '@/lib/liberation-utils';

interface VirtualScrollItem {
  id: string | number;
  height?: number;
  data: any;
}

interface VirtualScrollListProps {
  items: VirtualScrollItem[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: VirtualScrollItem, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onItemsVisible?: (startIndex: number, endIndex: number) => void;
  loadMoreItems?: () => void;
  hasNextPage?: boolean;
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  enableKeyboardNavigation?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

interface VisibleRange {
  start: number;
  end: number;
}

const VirtualScrollList: React.FC<VirtualScrollListProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
  onItemsVisible,
  loadMoreItems,
  hasNextPage = false,
  isLoading = false,
  loadingComponent,
  emptyComponent,
  enableKeyboardNavigation = true,
  ariaLabel = "Scrollable list",
  ariaDescribedBy
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate visible range with overscan
  const visibleRange = useMemo((): VisibleRange => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { start: startIndex, end: endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  // Handle scroll with performance optimization
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);

    // Trigger load more when near bottom
    if (loadMoreItems && hasNextPage && !isLoading) {
      const scrollHeight = event.currentTarget.scrollHeight;
      const clientHeight = event.currentTarget.clientHeight;
      const threshold = scrollHeight - clientHeight - (itemHeight * 3);

      if (newScrollTop >= threshold) {
        loadMoreItems();
      }
    }
  }, [loadMoreItems, hasNextPage, isLoading, itemHeight]);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(items.length - 1, prev + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      case 'PageDown':
        event.preventDefault();
        const pageDownIndex = Math.min(
          items.length - 1,
          focusedIndex + Math.floor(containerHeight / itemHeight)
        );
        setFocusedIndex(pageDownIndex);
        break;
      case 'PageUp':
        event.preventDefault();
        const pageUpIndex = Math.max(
          0,
          focusedIndex - Math.floor(containerHeight / itemHeight)
        );
        setFocusedIndex(pageUpIndex);
        break;
    }
  }, [
    enableKeyboardNavigation,
    items.length,
    focusedIndex,
    containerHeight,
    itemHeight
  ]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && scrollElementRef.current) {
      const focusedItemTop = focusedIndex * itemHeight;
      const focusedItemBottom = focusedItemTop + itemHeight;
      const visibleTop = scrollTop;
      const visibleBottom = scrollTop + containerHeight;

      if (focusedItemTop < visibleTop) {
        scrollElementRef.current.scrollTop = focusedItemTop;
      } else if (focusedItemBottom > visibleBottom) {
        scrollElementRef.current.scrollTop = focusedItemBottom - containerHeight;
      }
    }
  }, [focusedIndex, itemHeight, scrollTop, containerHeight]);

  // Report visible items to parent
  useEffect(() => {
    if (onItemsVisible) {
      onItemsVisible(visibleRange.start, visibleRange.end);
    }
  }, [visibleRange, onItemsVisible]);

  // Announce list changes for screen readers
  const announceListChanges = useCallback(() => {
    if (items.length > 0) {
      const announcer = document.getElementById('liberation-announcer');
      if (announcer) {
        announcer.textContent = `List updated. ${items.length} items available.`;
      }
    }
  }, [items.length]);

  useEffect(() => {
    announceListChanges();
  }, [announceListChanges]);

  // Handle empty state
  if (items.length === 0 && !isLoading) {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-center p-8',
          className
        )}
        style={{ height: containerHeight }}
        role="status"
        aria-label="Empty list"
      >
        {emptyComponent || (
          <div className="text-liberation-silver">
            <p className="text-lg font-medium mb-2">No items to display</p>
            <p className="text-sm opacity-75">Liberation stories will appear here when shared.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ height: containerHeight }}
    >
      {/* Scrollable container */}
      <div
        ref={scrollElementRef}
        className="w-full h-full overflow-auto focus:outline-none focus:ring-2 focus:ring-liberation-gold-divine focus:ring-opacity-50"
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={enableKeyboardNavigation ? 0 : -1}
        role="listbox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-live="polite"
        aria-rowcount={items.length}
      >
        {/* Virtual spacer before visible items */}
        <div style={{ height: visibleRange.start * itemHeight }} />

        {/* Visible items */}
        <div role="group" aria-label="Visible list items">
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            const isFocused = focusedIndex === actualIndex;

            return (
              <div
                key={item.id}
                style={{ height: itemHeight }}
                className={cn(
                  'relative',
                  isFocused && 'ring-2 ring-liberation-gold-divine ring-opacity-75'
                )}
                role="option"
                aria-selected={isFocused}
                aria-posinset={actualIndex + 1}
                aria-setsize={items.length}
                tabIndex={-1}
                onClick={() => setFocusedIndex(actualIndex)}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>

        {/* Virtual spacer after visible items */}
        <div style={{ height: (items.length - visibleRange.end - 1) * itemHeight }} />

        {/* Loading indicator */}
        {isLoading && (
          <div
            className="flex items-center justify-center p-4"
            style={{ height: itemHeight }}
            role="status"
            aria-label="Loading more items"
          >
            {loadingComponent || (
              <div className="flex items-center gap-2 text-liberation-silver">
                <div className="w-4 h-4 border-2 border-liberation-gold-divine border-t-transparent rounded-full animate-spin" />
                <span>Loading liberation stories...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Screen reader instructions */}
      <div className="sr-only" aria-live="polite">
        {enableKeyboardNavigation && (
          <p>
            Use arrow keys to navigate, Home and End to jump to beginning or end,
            Page Up and Page Down to navigate by page.
          </p>
        )}
      </div>

      {/* Scroll indicators for accessibility */}
      <div className="sr-only" aria-live="polite">
        {scrollTop > 0 && <span>Scrolled to item {Math.floor(scrollTop / itemHeight) + 1}</span>}
      </div>
    </div>
  );
};

// Memoized export for performance
export default React.memo(VirtualScrollList);

// Additional utility components for common use cases

// Liberation Stories Virtual List
export const LiberationStoriesList: React.FC<{
  stories: any[];
  onStorySelect?: (story: any) => void;
  isLoading?: boolean;
  loadMoreStories?: () => void;
  hasNextPage?: boolean;
}> = ({ stories, onStorySelect, isLoading, loadMoreStories, hasNextPage }) => {
  const renderStory = useCallback((item: VirtualScrollItem, index: number) => {
    const story = item.data;

    return (
      <div
        className="p-4 border-b border-liberation-silver border-opacity-20 hover:bg-liberation-black-power hover:bg-opacity-50 transition-colors cursor-pointer"
        onClick={() => onStorySelect?.(story)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onStorySelect?.(story);
          }
        }}
      >
        <h3 className="text-liberation-gold-divine font-semibold mb-2 line-clamp-2">
          {story.title}
        </h3>
        <p className="text-liberation-silver text-sm mb-2 line-clamp-3">
          {story.excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-liberation-silver opacity-75">
          <span>{story.author}</span>
          <span>•</span>
          <span>{new Date(story.createdAt).toLocaleDateString()}</span>
          {story.category && (
            <>
              <span>•</span>
              <span className="px-2 py-1 bg-liberation-purple-spirit bg-opacity-30 rounded text-liberation-gold-divine">
                {story.category}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }, [onStorySelect]);

  const storyItems: VirtualScrollItem[] = stories.map((story, index) => ({
    id: story.id || index,
    data: story,
    height: 120
  }));

  return (
    <VirtualScrollList
      items={storyItems}
      itemHeight={120}
      containerHeight={600}
      renderItem={renderStory}
      loadMoreItems={loadMoreStories}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      ariaLabel="Liberation stories list"
      emptyComponent={
        <div className="text-center text-liberation-silver">
          <p className="text-lg font-medium mb-2">No liberation stories yet</p>
          <p className="text-sm opacity-75">
            Share your story to inspire the community and build our collective liberation.
          </p>
        </div>
      }
    />
  );
};

// Community Events Virtual List
export const CommunityEventsList: React.FC<{
  events: any[];
  onEventSelect?: (event: any) => void;
  isLoading?: boolean;
  loadMoreEvents?: () => void;
  hasNextPage?: boolean;
}> = ({ events, onEventSelect, isLoading, loadMoreEvents, hasNextPage }) => {
  const renderEvent = useCallback((item: VirtualScrollItem, index: number) => {
    const event = item.data;
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();

    return (
      <div
        className="p-4 border-b border-liberation-silver border-opacity-20 hover:bg-liberation-black-power hover:bg-opacity-50 transition-colors cursor-pointer"
        onClick={() => onEventSelect?.(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEventSelect?.(event);
          }
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-center">
            <div className="text-liberation-gold-divine font-bold text-lg">
              {eventDate.getDate()}
            </div>
            <div className="text-liberation-silver text-xs uppercase">
              {eventDate.toLocaleDateString('en', { month: 'short' })}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-liberation-gold-divine font-semibold mb-2 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-liberation-silver text-sm mb-2 line-clamp-2">
              {event.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-liberation-silver opacity-75">
              <span>{eventDate.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
              {event.location && (
                <>
                  <span>•</span>
                  <span>{event.location}</span>
                </>
              )}
              <span>•</span>
              <span className={cn(
                'px-2 py-1 rounded',
                isUpcoming
                  ? 'bg-liberation-green-africa bg-opacity-30 text-liberation-green-africa'
                  : 'bg-liberation-silver bg-opacity-30 text-liberation-silver'
              )}>
                {isUpcoming ? 'Upcoming' : 'Past'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [onEventSelect]);

  const eventItems: VirtualScrollItem[] = events.map((event, index) => ({
    id: event.id || index,
    data: event,
    height: 140
  }));

  return (
    <VirtualScrollList
      items={eventItems}
      itemHeight={140}
      containerHeight={600}
      renderItem={renderEvent}
      loadMoreItems={loadMoreEvents}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      ariaLabel="Community events list"
      emptyComponent={
        <div className="text-center text-liberation-silver">
          <p className="text-lg font-medium mb-2">No community events scheduled</p>
          <p className="text-sm opacity-75">
            Check back soon for liberation gatherings and community events.
          </p>
        </div>
      }
    />
  );
};