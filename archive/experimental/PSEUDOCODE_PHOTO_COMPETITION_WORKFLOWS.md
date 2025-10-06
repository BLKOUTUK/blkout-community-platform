# BLKOUT Photo Competition - Core Workflow Pseudocode

## 🔄 Competition Lifecycle Management

### Competition Creation Workflow
```
FUNCTION createCompetition(competitionData):
  // Validate input data
  VALIDATE competitionData AGAINST competitionSchema

  IF startDate >= endDate OR votingStart >= votingEnd:
    THROW ValidationError("Invalid date sequence")

  IF startDate < NOW():
    THROW ValidationError("Competition cannot start in the past")

  // Create competition record
  competition = DATABASE.create('competitions', {
    title: competitionData.title,
    description: competitionData.description,
    start_date: competitionData.startDate,
    end_date: competitionData.endDate,
    voting_start: competitionData.votingStart,
    voting_end: competitionData.votingEnd,
    themes: ['Black', 'Out', 'Next'],
    max_submissions_per_theme: 3,
    status: 'draft',
    prizes: competitionData.prizes
  })

  // Initialize judging criteria
  FOR EACH judgingType IN ['curator_review', 'community_vote', 'board_final']:
    DATABASE.create('judging_criteria', {
      competition_id: competition.id,
      round_type: judgingType,
      criteria: getDefaultCriteria(judgingType)
    })

  // Schedule automated phase transitions
  SCHEDULE_JOB(competition.start_date, 'activateCompetition', competition.id)
  SCHEDULE_JOB(competition.voting_start, 'startVoting', competition.id)
  SCHEDULE_JOB(competition.voting_end, 'startJudging', competition.id)

  // Notify stakeholders
  SEND_NOTIFICATION('competition_created', {
    competition: competition,
    recipients: getCurators() + getBoardMembers()
  })

  RETURN competition
END FUNCTION

FUNCTION activateCompetition(competitionId):
  competition = DATABASE.findById('competitions', competitionId)

  IF competition.status != 'draft':
    THROW StateError("Competition not in draft state")

  // Transition to active
  DATABASE.update('competitions', competitionId, {
    status: 'active',
    activated_at: NOW()
  })

  // Notify community
  SEND_EMAIL_BLAST('competition_launched', {
    competition: competition,
    recipients: getAllCommunityMembers()
  })

  // Start curator preparation
  NOTIFY_CURATORS('competition_active', competition)

  LOG_EVENT('competition_activated', { competitionId })
END FUNCTION
```

## 📸 Photo Submission Workflow

### Submission Process
```
FUNCTION submitPhoto(userId, submissionData, imageFile):
  // Validate user eligibility
  user = AUTHENTICATE_USER(userId)
  competition = DATABASE.findById('competitions', submissionData.competitionId)

  IF competition.status != 'active':
    THROW ValidationError("Competition not accepting submissions")

  IF NOW() > competition.end_date:
    THROW ValidationError("Submission deadline passed")

  // Check submission limits
  existingSubmissions = DATABASE.find('photo_submissions', {
    competition_id: submissionData.competitionId,
    user_id: userId,
    theme: submissionData.theme
  })

  IF LENGTH(existingSubmissions) >= competition.max_submissions_per_theme:
    THROW ValidationError(`Maximum ${competition.max_submissions_per_theme} submissions per theme`)

  // Process image file
  processedImage = processImageUpload(imageFile)

  // Create submission record
  submission = DATABASE.create('photo_submissions', {
    competition_id: submissionData.competitionId,
    user_id: userId,
    theme: submissionData.theme,
    title: submissionData.title,
    description: submissionData.description,
    image_url: processedImage.url,
    image_metadata: processedImage.metadata,
    submission_order: LENGTH(existingSubmissions) + 1,
    status: 'submitted'
  })

  // Log submission event
  LOG_EVENT('photo_submitted', {
    submissionId: submission.id,
    userId: userId,
    theme: submissionData.theme,
    competitionId: submissionData.competitionId
  })

  // Notify curators
  ASYNC_NOTIFY_CURATORS('new_submission', submission)

  // Send confirmation to user
  SEND_EMAIL(user.email, 'submission_confirmation', {
    submission: submission,
    competition: competition
  })

  RETURN submission
END FUNCTION

FUNCTION processImageUpload(imageFile):
  // Validate file
  IF NOT isValidImageFile(imageFile):
    THROW ValidationError("Invalid image file format")

  IF imageFile.size > 10_000_000: // 10MB
    THROW ValidationError("File size too large")

  // Extract metadata
  metadata = EXTRACT_IMAGE_METADATA(imageFile)

  // Generate unique filename
  filename = GENERATE_UUID() + '.' + getFileExtension(imageFile)

  // Process image
  processedFile = IMAGE_PROCESSOR.process(imageFile, {
    maxWidth: 2400,
    maxHeight: 2400,
    quality: 85,
    format: 'jpeg'
  })

  // Generate thumbnail
  thumbnail = IMAGE_PROCESSOR.createThumbnail(processedFile, {
    width: 400,
    height: 400,
    quality: 80
  })

  // Upload to storage
  imageUrl = CLOUD_STORAGE.upload(processedFile, `competition-submissions/${filename}`)
  thumbnailUrl = CLOUD_STORAGE.upload(thumbnail, `competition-thumbnails/${filename}`)

  RETURN {
    url: imageUrl,
    thumbnailUrl: thumbnailUrl,
    metadata: {
      originalFilename: imageFile.name,
      fileSize: imageFile.size,
      dimensions: metadata.dimensions,
      cameraInfo: metadata.exif,
      uploadedAt: NOW()
    }
  }
END FUNCTION
```

## 👁️ Curator Review Workflow

### Curator Review Process
```
FUNCTION assignCuratorReviews(competitionId):
  curators = DATABASE.find('users', { role: 'curator', active: true })
  submissions = DATABASE.find('photo_submissions', {
    competition_id: competitionId,
    status: 'submitted'
  })

  // Distribute submissions evenly among curators
  submissionsPerCurator = CEILING(LENGTH(submissions) / LENGTH(curators))
  curatorIndex = 0

  FOR EACH submission IN submissions:
    curator = curators[curatorIndex]

    DATABASE.create('judging_rounds', {
      competition_id: competitionId,
      round_type: 'curator_review',
      judge_id: curator.id,
      submission_id: submission.id,
      status: 'assigned'
    })

    curatorIndex = (curatorIndex + 1) % LENGTH(curators)

  // Notify curators of assignments
  FOR EACH curator IN curators:
    assignedSubmissions = getAssignedSubmissions(curator.id, competitionId)
    SEND_EMAIL(curator.email, 'curator_assignment', {
      curator: curator,
      submissions: assignedSubmissions,
      deadline: getReviewDeadline(competitionId)
    })
END FUNCTION

FUNCTION submitCuratorReview(curatorId, submissionId, reviewData):
  // Validate curator assignment
  judging = DATABASE.findOne('judging_rounds', {
    judge_id: curatorId,
    submission_id: submissionId,
    round_type: 'curator_review'
  })

  IF NOT judging:
    THROW AuthorizationError("Curator not assigned to this submission")

  // Validate scores
  FOR EACH score IN reviewData.scores:
    IF score < 1 OR score > 10:
      THROW ValidationError("Scores must be between 1 and 10")

  // Calculate overall score
  overallScore = AVERAGE([
    reviewData.scores.themeRelevance * 0.3,
    reviewData.scores.technicalQuality * 0.25,
    reviewData.scores.communityImpact * 0.25,
    reviewData.scores.innovation * 0.2
  ])

  // Update judging record
  DATABASE.update('judging_rounds', judging.id, {
    scores: reviewData.scores,
    overall_score: overallScore,
    comments: reviewData.comments,
    recommendation: reviewData.recommendation,
    reviewed_at: NOW(),
    status: 'completed'
  })

  // Update submission status based on recommendation
  newStatus = CASE reviewData.recommendation:
    'advance' -> 'curator_approved'
    'reject' -> 'rejected'
    'featured' -> 'featured'
    DEFAULT -> 'curator_approved'

  DATABASE.update('photo_submissions', submissionId, {
    status: newStatus,
    curator_notes: reviewData.comments
  })

  // Notify photographer
  submission = DATABASE.findById('photo_submissions', submissionId)
  photographer = DATABASE.findById('users', submission.user_id)

  SEND_EMAIL(photographer.email, 'curator_review_completed', {
    submission: submission,
    status: newStatus,
    feedback: reviewData.comments
  })

  // Check if all curator reviews complete
  IF allCuratorReviewsComplete(submission.competition_id):
    TRIGGER_PHASE_TRANSITION(submission.competition_id, 'voting')
END FUNCTION
```

## 🗳️ Community Voting Workflow

### Voting System
```
FUNCTION initializeCommunityVoting(competitionId):
  competition = DATABASE.findById('competitions', competitionId)

  // Get approved submissions
  approvedSubmissions = DATABASE.find('photo_submissions', {
    competition_id: competitionId,
    status: 'curator_approved'
  })

  IF LENGTH(approvedSubmissions) == 0:
    THROW StateError("No submissions approved for voting")

  // Transition competition to voting phase
  DATABASE.update('competitions', competitionId, {
    status: 'voting',
    voting_started_at: NOW()
  })

  // Initialize vote tracking
  FOR EACH submission IN approvedSubmissions:
    DATABASE.create('vote_tracking', {
      submission_id: submission.id,
      total_votes: 0,
      total_weight: 0,
      average_score: 0
    })

  // Notify community members
  eligibleVoters = getEligibleVoters(competitionId)

  FOR EACH voter IN eligibleVoters:
    SEND_EMAIL(voter.email, 'voting_invitation', {
      competition: competition,
      submissionCount: LENGTH(approvedSubmissions),
      votingDeadline: competition.voting_end,
      personalizedVotingLink: generateVotingLink(voter.id, competitionId)
    })

  LOG_EVENT('voting_phase_started', { competitionId })
END FUNCTION

FUNCTION castVote(voterId, submissionId):
  // Validate voting eligibility
  voter = DATABASE.findById('users', voterId)
  submission = DATABASE.findById('photo_submissions', submissionId)
  competition = DATABASE.findById('competitions', submission.competition_id)

  IF competition.status != 'voting':
    THROW StateError("Voting is not currently active")

  IF NOW() > competition.voting_end:
    THROW ValidationError("Voting period has ended")

  // Check for existing vote
  existingVote = DATABASE.findOne('community_votes', {
    submission_id: submissionId,
    voter_id: voterId
  })

  IF existingVote:
    THROW ValidationError("User has already voted on this submission")

  // Check if voter is submission author
  IF submission.user_id == voterId:
    THROW ValidationError("Cannot vote on own submission")

  // Get voter weight (community members = 1.0, curators = 1.2, board = 1.5)
  voteWeight = getUserVoteWeight(voter.role)

  // Record vote
  vote = DATABASE.create('community_votes', {
    submission_id: submissionId,
    voter_id: voterId,
    vote_weight: voteWeight,
    voted_at: NOW()
  })

  // Update vote tracking
  updateVoteTracking(submissionId)

  // Log vote event
  LOG_EVENT('vote_cast', {
    voteId: vote.id,
    submissionId: submissionId,
    voterId: voterId,
    weight: voteWeight
  })

  RETURN {
    success: true,
    voteId: vote.id,
    newTotalVotes: getCurrentVoteCount(submissionId)
  }
END FUNCTION

FUNCTION updateVoteTracking(submissionId):
  votes = DATABASE.find('community_votes', { submission_id: submissionId })

  totalVotes = LENGTH(votes)
  totalWeight = SUM(votes, 'vote_weight')
  averageScore = totalWeight / totalVotes

  DATABASE.update('vote_tracking', { submission_id: submissionId }, {
    total_votes: totalVotes,
    total_weight: totalWeight,
    average_score: ROUND(averageScore, 2),
    last_updated: NOW()
  })

  // Update submission community score
  DATABASE.update('photo_submissions', submissionId, {
    community_score: ROUND(averageScore, 2)
  })
END FUNCTION

FUNCTION finalizeVotingResults(competitionId):
  competition = DATABASE.findById('competitions', competitionId)

  IF competition.status != 'voting':
    THROW StateError("Competition not in voting phase")

  // Calculate final voting results
  submissions = DATABASE.find('photo_submissions', {
    competition_id: competitionId,
    status: 'curator_approved'
  })

  results = []
  FOR EACH submission IN submissions:
    voteData = DATABASE.findOne('vote_tracking', { submission_id: submission.id })

    results.APPEND({
      submissionId: submission.id,
      theme: submission.theme,
      title: submission.title,
      photographerName: getPhotographerName(submission.user_id),
      totalVotes: voteData.total_votes,
      averageScore: voteData.average_score,
      rank: 0  // Will be calculated below
    })

  // Rank submissions by theme
  themes = ['Black', 'Out', 'Next']
  FOR EACH theme IN themes:
    themeSubmissions = FILTER(results, r => r.theme == theme)
    sortedTheme = SORT(themeSubmissions, 'averageScore', DESC)

    FOR i = 0 TO LENGTH(sortedTheme) - 1:
      sortedTheme[i].rank = i + 1

  // Determine shortlisted submissions (top 30% per theme)
  shortlisted = []
  FOR EACH theme IN themes:
    themeResults = FILTER(results, r => r.theme == theme)
    shortlistCount = MAX(1, CEILING(LENGTH(themeResults) * 0.3))
    topSubmissions = TAKE(SORT(themeResults, 'averageScore', DESC), shortlistCount)

    FOR EACH submission IN topSubmissions:
      shortlisted.APPEND(submission.submissionId)
      DATABASE.update('photo_submissions', submission.submissionId, {
        status: 'shortlisted'
      })

  // Transition to judging phase
  DATABASE.update('competitions', competitionId, {
    status: 'judging',
    judging_started_at: NOW()
  })

  // Store voting results
  DATABASE.create('voting_results', {
    competition_id: competitionId,
    results: JSON.stringify(results),
    shortlisted_submissions: shortlisted,
    created_at: NOW()
  })

  // Notify board members
  boardMembers = DATABASE.find('users', { role: 'board', active: true })
  FOR EACH member IN boardMembers:
    SEND_EMAIL(member.email, 'judging_phase_started', {
      competition: competition,
      shortlistedCount: LENGTH(shortlisted),
      judgingDeadline: getJudgingDeadline(competitionId)
    })

  LOG_EVENT('voting_completed', {
    competitionId: competitionId,
    totalVotes: SUM(results, 'totalVotes'),
    shortlistedCount: LENGTH(shortlisted)
  })
END FUNCTION
```

## 🏆 Board Judging & Final Results

### Board Judging Process
```
FUNCTION initializeBoardJudging(competitionId):
  competition = DATABASE.findById('competitions', competitionId)

  // Get shortlisted submissions
  shortlistedSubmissions = DATABASE.find('photo_submissions', {
    competition_id: competitionId,
    status: 'shortlisted'
  })

  IF LENGTH(shortlistedSubmissions) == 0:
    THROW StateError("No submissions shortlisted for board judging")

  // Get active board members
  boardMembers = DATABASE.find('users', { role: 'board', active: true })

  // Assign all shortlisted submissions to all board members
  FOR EACH member IN boardMembers:
    FOR EACH submission IN shortlistedSubmissions:
      DATABASE.create('judging_rounds', {
        competition_id: competitionId,
        round_type: 'board_final',
        judge_id: member.id,
        submission_id: submission.id,
        status: 'assigned'
      })

  // Send detailed judging instructions
  FOR EACH member IN boardMembers:
    SEND_EMAIL(member.email, 'board_judging_assignment', {
      judge: member,
      competition: competition,
      submissions: shortlistedSubmissions,
      judgingCriteria: getBoardJudgingCriteria(),
      deadline: getJudgingDeadline(competitionId)
    })
END FUNCTION

FUNCTION submitBoardJudgment(judgeId, submissionId, judgmentData):
  // Validate board member assignment
  judging = DATABASE.findOne('judging_rounds', {
    judge_id: judgeId,
    submission_id: submissionId,
    round_type: 'board_final'
  })

  IF NOT judging:
    THROW AuthorizationError("Board member not assigned to this submission")

  // Validate scores
  requiredScores = ['themeRelevance', 'technicalQuality', 'communityImpact', 'innovation']
  FOR EACH scoreType IN requiredScores:
    IF NOT judgmentData.scores[scoreType] OR
       judgmentData.scores[scoreType] < 1 OR
       judgmentData.scores[scoreType] > 10:
      THROW ValidationError(`Invalid ${scoreType} score`)

  // Calculate weighted overall score
  overallScore = (
    judgmentData.scores.themeRelevance * 0.30 +
    judgmentData.scores.technicalQuality * 0.25 +
    judgmentData.scores.communityImpact * 0.25 +
    judgmentData.scores.innovation * 0.20
  )

  // Update judging record
  DATABASE.update('judging_rounds', judging.id, {
    scores: judgmentData.scores,
    overall_score: overallScore,
    comments: judgmentData.comments,
    recommendation: judgmentData.recommendation,
    reviewed_at: NOW(),
    status: 'completed'
  })

  LOG_EVENT('board_judgment_submitted', {
    judgeId: judgeId,
    submissionId: submissionId,
    overallScore: overallScore
  })

  // Check if all board judgments complete
  IF allBoardJudgmentsComplete(submissionId):
    calculateSubmissionFinalScore(submissionId)

  // Check if entire competition judging complete
  IF allCompetitionJudgingComplete(getCompetitionId(submissionId)):
    finalizeCompetitionResults(getCompetitionId(submissionId))
END FUNCTION

FUNCTION calculateSubmissionFinalScore(submissionId):
  boardJudgments = DATABASE.find('judging_rounds', {
    submission_id: submissionId,
    round_type: 'board_final',
    status: 'completed'
  })

  IF LENGTH(boardJudgments) == 0:
    RETURN

  // Calculate average board score
  totalScore = SUM(boardJudgments, 'overall_score')
  averageBoardScore = totalScore / LENGTH(boardJudgments)

  // Get community voting score
  submission = DATABASE.findById('photo_submissions', submissionId)
  communityScore = submission.community_score OR 0

  // Calculate final weighted score (70% board, 30% community)
  finalScore = (averageBoardScore * 0.7) + (communityScore * 0.3)

  // Update submission with final score
  DATABASE.update('photo_submissions', submissionId, {
    board_score: ROUND(averageBoardScore, 2),
    final_score: ROUND(finalScore, 2),
    judging_completed_at: NOW()
  })

  LOG_EVENT('submission_final_score_calculated', {
    submissionId: submissionId,
    finalScore: finalScore,
    boardScore: averageBoardScore,
    communityScore: communityScore
  })
END FUNCTION

FUNCTION finalizeCompetitionResults(competitionId):
  // Get all judged submissions
  submissions = DATABASE.find('photo_submissions', {
    competition_id: competitionId,
    status: 'shortlisted',
    final_score: NOT_NULL
  })

  // Sort by final score
  sortedSubmissions = SORT(submissions, 'final_score', DESC)

  // Determine winners
  winners = {
    overall: TAKE(sortedSubmissions, 3),
    byTheme: {
      Black: getTopByTheme(sortedSubmissions, 'Black', 1),
      Out: getTopByTheme(sortedSubmissions, 'Out', 1),
      Next: getTopByTheme(sortedSubmissions, 'Next', 1)
    }
  }

  // Select monthly features (12 total, 4 per theme)
  monthlyFeatures = []
  FOR EACH theme IN ['Black', 'Out', 'Next']:
    themeSubmissions = FILTER(sortedSubmissions, s => s.theme == theme)
    features = TAKE(themeSubmissions, 4)
    monthlyFeatures = monthlyFeatures + features

  // Update submission statuses
  FOR EACH submission IN winners.overall:
    DATABASE.update('photo_submissions', submission.id, { status: 'winner' })

  FOR EACH submission IN monthlyFeatures:
    DATABASE.update('photo_submissions', submission.id, { status: 'featured' })

  // Store final results
  results = {
    competition_id: competitionId,
    overall_winners: winners.overall,
    theme_winners: winners.byTheme,
    monthly_features: monthlyFeatures,
    finalized_at: NOW()
  }

  DATABASE.create('competition_results', results)

  // Transition competition to completed
  DATABASE.update('competitions', competitionId, {
    status: 'completed',
    completed_at: NOW()
  })

  // Notify all participants
  notifyCompetitionResults(competitionId, results)

  // Initialize calendar production and sales
  initializeCalendarProduction(competitionId, monthlyFeatures)

  LOG_EVENT('competition_completed', {
    competitionId: competitionId,
    totalWinners: LENGTH(winners.overall) + LENGTH(monthlyFeatures),
    totalParticipants: getParticipantCount(competitionId)
  })
END FUNCTION
```

## 💰 Creator Sovereignty & Profit Sharing

### Royalty Calculation & Distribution
```
FUNCTION initializeCalendarProduction(competitionId, featuredSubmissions):
  // Create calendar product
  calendar = DATABASE.create('calendar_products', {
    competition_id: competitionId,
    year: 2026,
    featured_submissions: MAP(featuredSubmissions, s => s.id),
    production_cost: 8.00,  // £8 per calendar
    retail_price: 20.00,    // £20 per calendar
    profit_per_unit: 12.00, // £12 profit
    profit_distribution: {
      photographers: 0.50,   // 50% to photographers
      operations: 0.30,      // 30% to operations
      community_fund: 0.20   // 20% to community fund
    },
    status: 'production_ready'
  })

  // Calculate photographer shares
  photographerShares = {}
  FOR EACH submission IN featuredSubmissions:
    photographerId = submission.user_id

    IF NOT photographerShares[photographerId]:
      photographerShares[photographerId] = 0

    photographerShares[photographerId] += 1

  // Store photographer royalty entitlements
  FOR photographerId, shareCount IN photographerShares:
    royaltyShare = shareCount / LENGTH(featuredSubmissions)

    DATABASE.create('photographer_royalties', {
      calendar_id: calendar.id,
      photographer_id: photographerId,
      share_percentage: royaltyShare,
      images_featured: shareCount,
      created_at: NOW()
    })

  // Enable pre-orders
  enableCalendarPreOrders(calendar.id)

  LOG_EVENT('calendar_production_initialized', {
    calendarId: calendar.id,
    featuredPhotographers: LENGTH(photographerShares),
    totalImages: LENGTH(featuredSubmissions)
  })
END FUNCTION

FUNCTION processCalendarSale(calendarId, saleData):
  calendar = DATABASE.findById('calendar_products', calendarId)

  // Record sale
  sale = DATABASE.create('calendar_sales', {
    calendar_id: calendarId,
    customer_id: saleData.customerId,
    quantity: saleData.quantity,
    unit_price: calendar.retail_price,
    total_amount: calendar.retail_price * saleData.quantity,
    profit_amount: calendar.profit_per_unit * saleData.quantity,
    sale_date: NOW()
  })

  // Calculate profit distribution
  totalProfit = sale.profit_amount
  photographerProfit = totalProfit * calendar.profit_distribution.photographers
  operationsProfit = totalProfit * calendar.profit_distribution.operations
  communityProfit = totalProfit * calendar.profit_distribution.community_fund

  // Distribute to photographers
  photographerRoyalties = DATABASE.find('photographer_royalties', {
    calendar_id: calendarId
  })

  FOR EACH royalty IN photographerRoyalties:
    photographerEarnings = photographerProfit * royalty.share_percentage

    DATABASE.create('photographer_earnings', {
      photographer_id: royalty.photographer_id,
      sale_id: sale.id,
      calendar_id: calendarId,
      earnings_amount: photographerEarnings,
      share_percentage: royalty.share_percentage,
      created_at: NOW()
    })

    // Update photographer balance
    updatePhotographerBalance(royalty.photographer_id, photographerEarnings)

  // Record operational and community fund allocations
  DATABASE.create('fund_allocations', {
    sale_id: sale.id,
    operations_amount: operationsProfit,
    community_fund_amount: communityProfit,
    created_at: NOW()
  })

  LOG_EVENT('calendar_sale_processed', {
    saleId: sale.id,
    totalProfit: totalProfit,
    photographerCount: LENGTH(photographerRoyalties)
  })
END FUNCTION

FUNCTION processMonthlyPayouts():
  // Get all photographers with pending earnings
  photographersWithEarnings = DATABASE.query(`
    SELECT photographer_id, SUM(earnings_amount) as total_earnings
    FROM photographer_earnings
    WHERE payout_date IS NULL AND earnings_amount > 0
    GROUP BY photographer_id
    HAVING SUM(earnings_amount) >= 10.00  -- Minimum £10 for payout
  `)

  FOR EACH photographer IN photographersWithEarnings:
    user = DATABASE.findById('users', photographer.photographer_id)

    // Create payout record
    payout = DATABASE.create('photographer_payouts', {
      photographer_id: photographer.photographer_id,
      payout_amount: photographer.total_earnings,
      payout_method: user.preferred_payout_method OR 'bank_transfer',
      status: 'pending',
      requested_at: NOW()
    })

    // Mark earnings as paid
    DATABASE.update('photographer_earnings', {
      photographer_id: photographer.photographer_id,
      payout_date: NULL
    }, {
      payout_id: payout.id,
      payout_date: NOW()
    })

    // Process payment via payment processor
    paymentResult = PAYMENT_PROCESSOR.createPayout({
      recipientId: user.payment_recipient_id,
      amount: photographer.total_earnings,
      currency: 'GBP',
      description: `BLKOUT Calendar royalties for ${CURRENT_MONTH()}`
    })

    // Update payout status
    DATABASE.update('photographer_payouts', payout.id, {
      payment_processor_id: paymentResult.payoutId,
      status: paymentResult.success ? 'completed' : 'failed',
      processed_at: NOW(),
      failure_reason: paymentResult.error
    })

    // Notify photographer
    IF paymentResult.success:
      SEND_EMAIL(user.email, 'payout_completed', {
        amount: photographer.total_earnings,
        payout: payout
      })
    ELSE:
      SEND_EMAIL(user.email, 'payout_failed', {
        amount: photographer.total_earnings,
        reason: paymentResult.error,
        supportContact: 'finance@blkout.co.uk'
      })

  LOG_EVENT('monthly_payouts_processed', {
    photographerCount: LENGTH(photographersWithEarnings),
    totalAmount: SUM(photographersWithEarnings, 'total_earnings')
  })
END FUNCTION
```

## 📊 Analytics & Reporting

### Competition Analytics
```
FUNCTION generateCompetitionAnalytics(competitionId):
  competition = DATABASE.findById('competitions', competitionId)

  // Participation metrics
  totalSubmissions = DATABASE.count('photo_submissions', {
    competition_id: competitionId
  })

  uniquePhotographers = DATABASE.count_distinct('photo_submissions', 'user_id', {
    competition_id: competitionId
  })

  submissionsByTheme = DATABASE.query(`
    SELECT theme, COUNT(*) as count
    FROM photo_submissions
    WHERE competition_id = '${competitionId}'
    GROUP BY theme
  `)

  // Quality metrics
  curatorApprovalRate = DATABASE.query(`
    SELECT
      COUNT(CASE WHEN status = 'curator_approved' THEN 1 END) * 100.0 / COUNT(*) as approval_rate
    FROM photo_submissions
    WHERE competition_id = '${competitionId}' AND status IN ('curator_approved', 'rejected')
  `)[0].approval_rate

  // Community engagement
  totalVotes = DATABASE.count('community_votes', {
    submission_id: IN (getSubmissionIds(competitionId))
  })

  uniqueVoters = DATABASE.count_distinct('community_votes', 'voter_id', {
    submission_id: IN (getSubmissionIds(competitionId))
  })

  // Geographic distribution
  photographerLocations = DATABASE.query(`
    SELECT u.location, COUNT(*) as count
    FROM photo_submissions ps
    JOIN users u ON ps.user_id = u.id
    WHERE ps.competition_id = '${competitionId}'
    GROUP BY u.location
    ORDER BY count DESC
  `)

  // Compile analytics report
  analytics = {
    competition: {
      id: competitionId,
      title: competition.title,
      duration: DAYS_BETWEEN(competition.start_date, competition.end_date),
      status: competition.status
    },
    participation: {
      total_submissions: totalSubmissions,
      unique_photographers: uniquePhotographers,
      average_submissions_per_photographer: totalSubmissions / uniquePhotographers,
      submissions_by_theme: submissionsByTheme,
      photographer_locations: photographerLocations
    },
    quality: {
      curator_approval_rate: ROUND(curatorApprovalRate, 2),
      submissions_reviewed: getReviewedCount(competitionId),
      average_review_time: getAverageReviewTime(competitionId)
    },
    engagement: {
      total_votes: totalVotes,
      unique_voters: uniqueVoters,
      average_votes_per_submission: totalVotes / totalSubmissions,
      voting_participation_rate: (uniqueVoters / getTotalCommunityMembers()) * 100
    },
    timeline: {
      daily_submissions: getDailySubmissionCounts(competitionId),
      voting_activity: getVotingActivityByDay(competitionId)
    }
  }

  // Store analytics
  DATABASE.create('competition_analytics', {
    competition_id: competitionId,
    analytics_data: JSON.stringify(analytics),
    generated_at: NOW()
  })

  RETURN analytics
END FUNCTION
```

---

This pseudocode provides the detailed implementation logic for all core workflows in the BLKOUT Photo Competition Platform, following the SPARC methodology with clear, testable, and maintainable code structures.