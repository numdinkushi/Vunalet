// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title VunaletPayments
 * @dev Smart contract for processing payments on the Vunalet platform
 * @notice This contract handles order payments and distributes funds to farmers and dispatchers
 * @notice Frontend is the single source of truth for payment calculations
 */
contract VunaletPayments is Ownable, ReentrancyGuard, Pausable {
    // Payment structure
    struct Payment {
        address buyer;
        address farmer;
        address dispatcher;
        uint256 totalAmount;
        uint256 farmerAmount;
        uint256 dispatcherAmount;
        uint256 platformAmount;
        string orderId;
        uint256 timestamp;
        bool completed;
    }

    // Events
    event PaymentProcessed(
        string indexed orderId,
        address indexed buyer,
        address indexed farmer,
        uint256 totalAmount
    );

    event PaymentDistributed(
        string indexed orderId,
        address indexed recipient,
        uint256 amount,
        string recipientType
    );

    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    // Mappings
    mapping(string => Payment) public payments;
    mapping(address => uint256) public userTotalPaid;
    mapping(address => uint256) public farmerTotalEarned;
    mapping(address => uint256) public dispatcherTotalEarned;

    // Platform fee (in basis points, 100 = 1%) - kept for backward compatibility
    uint256 public platformFeeRate = 250; // 2.5%
    address public feeRecipient;

    // Frontend authorization hash
    bytes32 public secretHash;

    // Constants
    uint256 public constant MAX_FEE_RATE = 1000; // 10% maximum fee

    constructor(
        address _feeRecipient,
        bytes32 _secretHash
    ) Ownable(msg.sender) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        require(_secretHash != bytes32(0), "Invalid secret hash");
        feeRecipient = _feeRecipient;
        secretHash = _secretHash;
    }

    /**
     * @dev Process order payment and distribute funds
     * @param orderId Unique identifier for the order
     * @param farmer Address of the farmer receiving payment
     * @param dispatcher Address of the dispatcher (can be zero address)
     * @param farmerAmount Amount to be paid to the farmer (in wei)
     * @param dispatcherAmount Amount to be paid to the dispatcher (in wei)
     * @param platformAmount Amount to be paid to the platform (in wei)
     * @param secret Frontend authorization secret
     * @notice Frontend calculates all amounts and sends exact distribution
     */
    function processOrderPayment(
        string memory orderId,
        address farmer,
        address dispatcher,
        uint256 farmerAmount,
        uint256 dispatcherAmount,
        uint256 platformAmount,
        string memory secret
    ) external payable nonReentrant whenNotPaused {
        // Verify frontend authorization
        require(
            keccak256(abi.encodePacked(secret)) == secretHash,
            "Invalid secret"
        );

        require(msg.value > 0, "Payment amount must be greater than 0");
        require(farmer != address(0), "Invalid farmer address");
        require(bytes(orderId).length > 0, "Order ID required");
        require(!payments[orderId].completed, "Payment already processed");

        uint256 totalAmount = msg.value;
        uint256 expectedTotal = farmerAmount + dispatcherAmount + platformAmount;

        // Verify that the total payment matches the expected distribution
        // Frontend is the single source of truth for calculations
        require(
            totalAmount == expectedTotal,
            "Payment amount mismatch"
        );

        // Store payment record
        payments[orderId] = Payment({
            buyer: msg.sender,
            farmer: farmer,
            dispatcher: dispatcher,
            totalAmount: totalAmount,
            farmerAmount: farmerAmount,
            dispatcherAmount: dispatcherAmount,
            platformAmount: platformAmount,
            orderId: orderId,
            timestamp: block.timestamp,
            completed: true
        });

        // Update user statistics
        userTotalPaid[msg.sender] += totalAmount;
        farmerTotalEarned[farmer] += farmerAmount;

        // Distribute payments
        if (farmerAmount > 0) {
            payable(farmer).transfer(farmerAmount);
            emit PaymentDistributed(orderId, farmer, farmerAmount, "farmer");
        }

        if (dispatcher != address(0) && dispatcherAmount > 0) {
            dispatcherTotalEarned[dispatcher] += dispatcherAmount;
            payable(dispatcher).transfer(dispatcherAmount);
            emit PaymentDistributed(
                orderId,
                dispatcher,
                dispatcherAmount,
                "dispatcher"
            );
        }

        // Transfer platform fee
        if (platformAmount > 0) {
            payable(feeRecipient).transfer(platformAmount);
            emit PaymentDistributed(
                orderId,
                feeRecipient,
                platformAmount,
                "platform"
            );
        }

        emit PaymentProcessed(orderId, msg.sender, farmer, totalAmount);
    }

    /**
     * @dev Get payment details for a specific order
     * @param orderId The order identifier
     * @return Payment struct containing all payment details
     */
    function getPayment(
        string memory orderId
    ) external view returns (Payment memory) {
        return payments[orderId];
    }

    /**
     * @dev Get user statistics
     * @param user Address of the user
     * @return totalPaid Total amount paid by user
     * @return totalEarnedAsFarmer Total earned as farmer
     * @return totalEarnedAsDispatcher Total earned as dispatcher
     */
    function getUserStats(
        address user
    )
        external
        view
        returns (
            uint256 totalPaid,
            uint256 totalEarnedAsFarmer,
            uint256 totalEarnedAsDispatcher
        )
    {
        return (
            userTotalPaid[user],
            farmerTotalEarned[user],
            dispatcherTotalEarned[user]
        );
    }

    // Admin functions

    /**
     * @dev Set platform fee rate (only owner)
     * @param _feeRate New fee rate in basis points (100 = 1%)
     * @notice This is kept for backward compatibility but not used in new payment flow
     */
    function setPlatformFeeRate(uint256 _feeRate) external onlyOwner {
        require(_feeRate <= MAX_FEE_RATE, "Fee rate cannot exceed maximum");
        uint256 oldFee = platformFeeRate;
        platformFeeRate = _feeRate;
        emit PlatformFeeUpdated(oldFee, _feeRate);
    }

    /**
     * @dev Set fee recipient address (only owner)
     * @param _feeRecipient New fee recipient address
     */
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        address oldRecipient = feeRecipient;
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(oldRecipient, _feeRecipient);
    }

    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Set secret hash for frontend verification (only owner)
     * @param _secretHash New secret hash
     */
    function setSecretHash(bytes32 _secretHash) external onlyOwner {
        require(_secretHash != bytes32(0), "Invalid secret hash");
        secretHash = _secretHash;
    }

    /**
     * @dev Withdraw specific amount (only owner)
     * @param amount Amount to withdraw in wei
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        payable(owner()).transfer(amount);
    }

    /**
     * @dev Withdraw to specific address (only owner)
     * @param to Recipient address
     * @param amount Amount to withdraw in wei
     */
    function withdrawTo(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        to.transfer(amount);
    }

    /**
     * @dev Emergency withdrawal function (only owner)
     * @notice This should only be used in extreme circumstances
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Get contract balance
     * @return Current contract balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Receive function to accept Ether
     */
    receive() external payable {
        // Allow contract to receive Ether
    }
}
